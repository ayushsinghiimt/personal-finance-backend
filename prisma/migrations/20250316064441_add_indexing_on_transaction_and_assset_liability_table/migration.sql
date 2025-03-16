-- CreateIndex
CREATE INDEX "AssetLiability_userId_idx" ON "AssetLiability"("userId");

-- CreateIndex
CREATE INDEX "AssetLiability_categoryId_idx" ON "AssetLiability"("categoryId");

-- CreateIndex
CREATE INDEX "AssetLiability_createdAt_idx" ON "AssetLiability"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_mobileNo_idx" ON "User"("mobileNo");
