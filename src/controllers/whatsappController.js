const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const prisma = require("../config/db");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.processMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const files = req.files || [];
        console.log("text is", text)

        // 1. Identify User
        // Prefer req.user from auth middleware, fallback to mobileNo from body if needed (though auth is now enforced)
        let user = req.user;

        if (!user && req.body.mobileNo) {
            user = await prisma.user.findFirst({
                where: { mobileNo: req.body.mobileNo },
            });
        }

        if (!user) {
            // Clean up files if user validation fails
            files.forEach(file => { try { fs.unlinkSync(file.path); } catch (e) { } });
            return res.status(404).json({ error: "User not found or unauthenticated" });
        }

        // 2. Fetch Categories for context
        const categories = await prisma.category.findMany();
        const categoryNames = categories.map((c) => c.name).join(", ");

        // 3. Prepare Gemini Request
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt = `
      You are a financial assistant. Extract transaction details from the following input.
      The input can be a text description and/or multiple images/PDFs of receipts/invoices.
      
      Instructions:
      1. Analyze all provided text and files.
      2. Identify ALL distinct transactions. 
      3. If multiple files belong to the same transaction (e.g., multi-page invoice), merge them into one transaction.
      4. If multiple files represent different transactions, list them separately.
      
      Available Categories: ${categoryNames}
      
      Output JSON format (Array of objects):
      [
        {
          "amount": Number,
          "type": "INCOME" or "EXPENSE",
          "category": "One of the available categories",
          "description": "Short description",
          "date": "ISO 8601 Date string (YYYY-MM-DDTHH:mm:ss.sssZ)"
        }
      ]
      
      If the date is not specified, use the current date: ${new Date().toISOString()}
      If the category doesn't match exactly, pick the closest one.
      
      Input Text: ${text || ""}
    `;

        const parts = [{ text: prompt }];

        // Add all files to the request
        for (const file of files) {
            const mimeType = file.mimetype;
            const data = fs.readFileSync(file.path).toString("base64");

            parts.push({
                inlineData: {
                    mimeType,
                    data
                }
            });
        }

        // 4. Call Gemini
        console.log("parts", parts);
        const result = await model.generateContent(parts);
        console.log("result", result);
        const response = await result.response;
        const textResponse = response.text();
        console.log("textResponse", textResponse);
        // Clean up markdown code blocks if present
        const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("cleanJson", cleanJson);
        let transactionsData;
        try {
            transactionsData = JSON.parse(cleanJson);
            // Ensure it's an array
            if (!Array.isArray(transactionsData)) {
                transactionsData = [transactionsData];
            }
        } catch (e) {
            console.error("Failed to parse Gemini response:", textResponse);
            throw new Error("Failed to parse transaction data from AI response");
        }
        console.log("transactionsData", transactionsData);

        const createdTransactions = [];

        // 5. Process and Save Each Transaction
        for (const data of transactionsData) {
            // Match Category ID
            const matchedCategory = categories.find(
                (c) => c.name.toLowerCase() === (data.category || "").toLowerCase()
            );

            let categoryId = matchedCategory ? matchedCategory.id : categories[0]?.id;

            if (categoryId) {
                const newTransaction = await prisma.transaction.create({
                    data: {
                        userId: user.id,
                        categoryId: categoryId,
                        amount: data.amount,
                        type: data.type,
                        description: data.description,
                        date: data.date,
                    },
                });
                createdTransactions.push(newTransaction);
            }
        }

        // Clean up uploaded files
        files.forEach(file => {
            try { fs.unlinkSync(file.path); } catch (e) { }
        });

        res.json({
            message: "Transactions processed successfully",
            count: createdTransactions.length,
            transactions: createdTransactions,
            geminiResponse: transactionsData
        });

    } catch (error) {
        console.error("Error processing WhatsApp message:", error);
        // Clean up files on error
        if (req.files) {
            req.files.forEach(file => { try { fs.unlinkSync(file.path); } catch (e) { } });
        }
        res.status(500).json({ error: error.message });
    }
};
