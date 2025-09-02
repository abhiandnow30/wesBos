const axios = require('axios');
const fs = require('fs');
const path = require('path');

class DocuSignAPI {
    constructor(auth) {
        this.auth = auth;
    }

    /**
     * Encode file to Base64
     */
    encodeFileToBase64(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            return fileBuffer.toString('base64');
        } catch (error) {
            throw new Error(`Failed to encode file ${filePath}: ${error.message}`);
        }
    }

    /**
     * Create envelope with document for signature
     */
    async createEnvelope(documentPath, recipientName, recipientEmail) {
        try {
            // Encode document to Base64
            const documentBase64 = this.encodeFileToBase64(documentPath);
            const documentName = path.basename(documentPath);

            // Get API base URL and headers
            const apiBaseUrl = this.auth.getApiBaseUrl();
            const headers = this.auth.getAuthHeaders();

            // Prepare envelope data
            const envelopeData = {
                emailSubject: "Please sign this document",
                emailBlurb: "This is a test document for signature.",
                documents: [{
                    documentBase64: documentBase64,
                    name: documentName,
                    fileExtension: path.extname(documentPath).substring(1),
                    documentId: "1"
                }],
                recipients: {
                    signers: [{
                        email: recipientEmail,
                        name: recipientName,
                        recipientId: "1",
                        routingOrder: "1",
                        tabs: {
                            signHereTabs: [{
                                anchorString: "/signHere/",
                                anchorUnits: "pixels",
                                anchorYOffset: "10",
                                anchorXOffset: "20"
                            }]
                        }
                    }]
                },
                status: "sent"
            };

            // Send envelope
            const response = await axios.post(
                `${apiBaseUrl}/envelopes`,
                envelopeData,
                { headers }
            );

            const envelopeId = response.data.envelopeId;
            console.log(`✅ Envelope created successfully!`);
            console.log(`📄 Envelope ID: ${envelopeId}`);
            console.log(`📧 Sent to: ${recipientEmail}`);

            return {
                envelopeId: envelopeId,
                status: response.data.status,
                uri: response.data.uri
            };

        } catch (error) {
            throw new Error(`Failed to create envelope: ${error.response?.data?.errorCode || error.message}`);
        }
    }

    /**
     * Get envelope status
     */
    async getEnvelopeStatus(envelopeId) {
        try {
            const apiBaseUrl = this.auth.getApiBaseUrl();
            const headers = this.auth.getAuthHeaders();

            const response = await axios.get(
                `${apiBaseUrl}/envelopes/${envelopeId}`,
                { headers }
            );

            return {
                envelopeId: response.data.envelopeId,
                status: response.data.status,
                created: response.data.created,
                lastModified: response.data.lastModified
            };

        } catch (error) {
            throw new Error(`Failed to get envelope status: ${error.response?.data?.errorCode || error.message}`);
        }
    }

    /**
     * Get envelope recipients
     */
    async getEnvelopeRecipients(envelopeId) {
        try {
            const apiBaseUrl = this.auth.getApiBaseUrl();
            const headers = this.auth.getAuthHeaders();

            const response = await axios.get(
                `${apiBaseUrl}/envelopes/${envelopeId}/recipients`,
                { headers }
            );

            return response.data;

        } catch (error) {
            throw new Error(`Failed to get envelope recipients: ${error.response?.data?.errorCode || error.message}`);
        }
    }
}

module.exports = DocuSignAPI;
