const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const prisma = require("../config/db");
const { MessagingResponse } = require("twilio").twiml;

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

        // 2. Prepare Media Parts
        const mediaParts = [];
        for (const file of files) {
            const mimeType = file.mimetype;
            const data = fs.readFileSync(file.path).toString("base64");
            mediaParts.push({
                inlineData: {
                    mimeType,
                    data
                }
            });
        }

        // 3. Call Shared Processing Logic
        const result = await processTransactionWithGemini(user, text, mediaParts);

        // Clean up uploaded files
        files.forEach(file => {
            try { fs.unlinkSync(file.path); } catch (e) { }
        });

        res.json({
            message: "Transactions processed successfully",
            count: result.count,
            transactions: result.transactions,
            geminiResponse: result.geminiResponse
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

// Helper function to process transaction with Gemini
async function processTransactionWithGemini(user, text, mediaParts) {
    // 1. Fetch Categories for context
    const categories = await prisma.category.findMany();
    const categoryNames = categories.map((c) => c.name).join(", ");

    // 2. Prepare Gemini Request
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

    const parts = [{ text: prompt }, ...mediaParts];

    // 3. Call Gemini
    console.log("Sending request to Gemini...");
    const result = await model.generateContent(parts);
    const response = await result.response;
    const textResponse = response.text();
    console.log("Gemini Response:", textResponse);

    // Clean up markdown code blocks if present
    const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

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

    const createdTransactions = [];

    // 4. Process and Save Each Transaction
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

    return {
        count: createdTransactions.length,
        transactions: createdTransactions,
        geminiResponse: transactionsData
    };
}

exports.handleTwilioWebhook = async (req, res) => {
    try {
        console.log("*******************************************************************")
        const { Body, From, NumMedia, MessageType } = req.body;
        console.log(`Received message from ${From}: ${Body}`);
        console.log(req.body);

        const twiml = new MessagingResponse();

        const SUPPORTED_MIME_TYPES = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'text/csv',
            'image/jpg'
        ];

        // Check for "document" type with 0 media (often means unsupported file type like .txt)
        if (MessageType === 'document' && (!NumMedia || NumMedia === '0')) {
            const responseMessage = "File type not supported. Please send PDF, JPEG, JPG, PNG, or CSV files.";
            twiml.message(responseMessage);
            res.type('text/xml');
            return res.send(twiml.toString());
        }

        let mediaParts = [];
        if (NumMedia && parseInt(NumMedia) > 0) {
            const contentType = req.body['MediaContentType0'];
            const mediaUrl = req.body['MediaUrl0'];
            console.log(`Processing media: NumMedia=${NumMedia}, ContentType=${contentType}, Url=${mediaUrl}`);

            if (!SUPPORTED_MIME_TYPES.includes(contentType)) {
                console.log(`Unsupported content type: ${contentType}`);
                const responseMessage = "File type not supported. Please send PDF, JPEG, JPG, PNG, or CSV files.";
                twiml.message(responseMessage);
                res.type('text/xml');
                return res.send(twiml.toString());
            }

            // Download media
            try {
                const accountSid = process.env.TWILLO_SID;
                const authToken = process.env.TWILLO_AUTH_TOKEN;
                const auth = Buffer.from(accountSid + ":" + authToken).toString("base64");

                const mediaResponse = await fetch(mediaUrl, {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                });
                if (!mediaResponse.ok) throw new Error("Failed to download media");
                const arrayBuffer = await mediaResponse.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Data = buffer.toString("base64");

                mediaParts.push({
                    inlineData: {
                        mimeType: contentType,
                        data: base64Data
                    }
                });
                console.log("Media downloaded and prepared.");
            } catch (err) {
                console.error("Error downloading media:", err);
                twiml.message("Failed to download media. Please try again.");
                res.type('text/xml');
                return res.send(twiml.toString());
            }
        }

        // Identify User
        // Format From: "whatsapp:+917352855062" -> "+917352855062" or "917352855062"
        // Assuming DB stores as "+91..." or just number. Let's try to match flexible.
        const mobileNo = From.replace("whatsapp:", "");

        // Try exact match first, then maybe without '+' if needed? 
        // For now assuming DB has the number as is or with +
        let user = await prisma.user.findFirst({
            where: { mobileNo: mobileNo },
        });

        if (!user) {
            console.log(`User not found for mobile: ${mobileNo}`);
            twiml.message("User not registered. Please sign up first.");
            res.type('text/xml');
            return res.send(twiml.toString());
        }

        // Process with Gemini
        const result = await processTransactionWithGemini(user, Body, mediaParts);

        // Dynamic response
        let responseMessage = `Processed ${result.count} transaction(s).`;
        if (result.transactions.length > 0) {
            const t = result.transactions[0];
            responseMessage += `\nLast: ${t.type} of ${t.amount} for ${t.description}`;
        }

        twiml.message(responseMessage);
        res.type('text/xml');
        res.send(twiml.toString());

    } catch (error) {
        console.error("Error handling Twilio webhook:", error);
        const twiml = new MessagingResponse();
        twiml.message("An error occurred while processing your request.");
        res.type('text/xml');
        res.send(twiml.toString());
    }
};

