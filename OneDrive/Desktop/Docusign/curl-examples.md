# DocuSign API Integration - cURL Examples

This document provides complete cURL examples for DocuSign API integration using JWT authentication.

## Prerequisites

- DocuSign Developer Account
- Integration Key (Client ID)
- User ID (API User ID)
- Private Key (RSA Private Key)
- Account ID (retrieved from user info)

## Configuration

```bash
# Set your DocuSign credentials
INTEGRATION_KEY="81c782d7-b9d5-4890-a174-5932b9717174"
USER_ID="194a2f9c-4cda-41a0-a0ad-196d03a5c8e4"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAv3r1BevhUi2E0LJNA7eCXuyGioDjB12rU8gAaEeLUufFBwD8
7jajMYiKsygg6CpjEi1q1zNb35+xroX/eIi7kUO8655MZ90fyzgDijMPhZ19u6Pg
MfaqeQyznoBcwuGII1LV0FRO0D+44ajm2LKYyXROfkom0ldTnpBfs77aH98w2aBZ
Dhy9wTIaGsoEvl04neySTXlu4c3SGbUg4du1xuKLqwP3ire84sVXF0tlPOgAayJE
E+VTHOtOckFpz7w6J94rI3PSNqFTzhrqDDhRb6Co7NIJJycMTrNVTHE6s1vRY9tR
JowfLAvFN+8m7SrEqPkFkiJF4qaFZP4ZBC0GuQIDAQABAoIBAAa+2WZnwKSRO3JR
sbJdkt9utC+pajYOd/Rn4ZHK4W7egNumDoMC1D1wurgkhAJBygMwK+kgY05ttQf5
qv4PTRJJQVzIkxb+nHnfg4ppEZUqruz/ES0ZbDh++M3u5jWsVcwuxR8FdVBTSltS
xK0iH41LRl+fE56J2oWFvwVZRhxkw/ajdNS8lDYkmJUoQElfdVohPHm+xQ1PMxaR
7AiLzHYG6tqNpYOlc8UDYK9D0GVjnnycTIJG2/e+bWI4pSBIBB8NAX3T7M7DxKH3
nh+MNsJM0rRV4JkhIHEXOav35T/NMonTA4XsK3dWS7/SqAT5fkYFe5xR1OnKgTPf
o+55MsECgYEA/o7g34EPVJye/rgA0heht1BWPp1FuvqEgTA5I9q9Goj0uaLKWX9N
VruPaSmORGNbkExQGi7erT7kjGW1Sw7d4dbWUuETuUaA4hUI9QG600Nh6HaFEroU
gStS/djPbmZ+Dxv37Y6TM4fS17IxxJFnun5fnlVv6vCUiX5ANr44alkCgYEAwJCc
4gI1sc0/j0kUYea2Uvjc+aBDXBNjxdz7L9ff37QWeNutkLTK2TKWZymy2pVMePct
L1jilYAtDcPqhppgZKwpdxbV5SKDsglSQk7Iv4JAzXkllDYMvfQmSxEa/wjtzJcp
2BUxWCOnG5S4KZmMvDbg9po0bB5nlgOIfOLlM2ECgYBWRo6osdFEWCD7K9n7Ws8Q
lkXkyuELUkT+lB2JrWVSTQDEugvi8WaA8ujUN6VkQFiUO4kalrAZ/6ruerpLSiqh
lHLnfCl3LhIYjhCPGZr8Z2YTp7fKdQ7mCI0ERCtpu4sWC+Cnvx7c5DftqxN7D90c
NCCsRUC9W/S79PJGm4n7YQKBgCK38BEvpM6x2svSuUINfsHm7LB1HK/1Lv/1n7Q4
j7ydk4+my9xTPF98p3FiK0UNtgP5TMREmlWqDnV05UvveYGtKKy4CUiOuH/Y/mPG
IJumuFhTh1r5g8KbymuuYdepnHZOqtSyvXrOsspePfYCIUWt/1F27AyyTqrVaD5c
CkcBAoGBAK4e/UCmzOdkw4WJwMEoZATZJATQ8YvsTxAcZ9TN27yD1vYfP320Whr+
KkIIKFvsXBQ/FPCHsn7uM1h6FjvYdYew4mIc1rBwXncBjm6yy8gDic/55x1ePcsN
7+3ZGmB3rqWjXd01hghl6xskaih628ExEkKC1e7ACL7TYqNKcy1z
-----END RSA PRIVATE KEY-----"

# Environment URLs
AUTH_SERVER="https://account-d.docusign.com"  # Sandbox
# AUTH_SERVER="https://account.docusign.com"  # Production

# These will be retrieved from user info
ACCOUNT_ID="1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67"
BASE_URI="https://demo.docusign.net"  # Sandbox
# BASE_URI="https://na2.docusign.net"  # Production
```

## Step 1: Generate JWT Token

```bash
# Create JWT payload (you'll need to generate this programmatically)
JWT_PAYLOAD='{
  "iss": "'$INTEGRATION_KEY'",
  "sub": "'$USER_ID'",
  "aud": "'$AUTH_SERVER'",
  "iat": '$(date +%s)',
  "exp": '$(( $(date +%s) + 3600 ))',
  "scope": "signature impersonation"
}'

# Note: You'll need to sign this with your private key using a JWT library
# For this example, we'll assume you have a JWT token
JWT_TOKEN="your_generated_jwt_token_here"
```

## Step 2: Exchange JWT for Access Token

```bash
curl -X POST "$AUTH_SERVER/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=$JWT_TOKEN"
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Step 3: Get User Information

```bash
ACCESS_TOKEN="your_access_token_here"

curl -X GET "$AUTH_SERVER/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Response:**
```json
{
  "sub": "194a2f9c-4cda-41a0-a0ad-196d03a5c8e4",
  "name": "Abhilasha Kandakatla",
  "given_name": "Abhilasha",
  "family_name": "Kandakatla",
  "created": "2024-01-01T00:00:00.000Z",
  "accounts": [
    {
      "account_id": "1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67",
      "is_default": true,
      "account_name": "CloudFuze Demo Account",
      "base_uri": "https://demo.docusign.net"
    }
  ]
}
```

## Step 4: Send Document for Signature

```bash
# Create a sample document (base64 encoded)
DOCUMENT_CONTENT="CloudFuze Purchase Agreement

This is a sample document for DocuSign integration testing.

Agreement Details:
- Company: CloudFuze, Inc.
- Service: Microsoft Cloud Migration
- Date: $(date +%Y-%m-%d)
- Contact: Abhilasha.Kandakatla@cloudfuze.com

Please review and sign this document to proceed with the agreement."

DOCUMENT_BASE64=$(echo "$DOCUMENT_CONTENT" | base64)

curl -X POST "$BASE_URI/restapi/v2.1/accounts/$ACCOUNT_ID/envelopes" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emailSubject": "Please sign: CloudFuze Purchase Agreement",
    "emailBlurb": "This is a demo agreement for testing DocuSign integration. Please review and sign.",
    "documents": [
      {
        "documentBase64": "'$DOCUMENT_BASE64'",
        "name": "CloudFuze Purchase Agreement",
        "fileExtension": "txt",
        "documentId": "1"
      }
    ],
    "recipients": {
      "signers": [
        {
          "email": "Abhilasha.Kandakatla@cloudfuze.com",
          "name": "Abhilasha Kandakatla",
          "recipientId": "1",
          "routingOrder": "1",
          "tabs": {
            "signHereTabs": [
              {
                "anchorString": "Please review and sign",
                "anchorUnits": "pixels",
                "anchorYOffset": "10",
                "anchorXOffset": "20"
              }
            ]
          }
        }
      ]
    },
    "status": "sent"
  }'
```

**Response:**
```json
{
  "envelopeId": "d1b03d9e-6d23-4f42-924d-3dcd77635989",
  "status": "sent",
  "statusDateTime": "2025-08-30T11:11:01.8230000Z",
  "uri": "/restapi/v2.1/accounts/1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67/envelopes/d1b03d9e-6d23-4f42-924d-3dcd77635989"
}
```

## Step 5: Check Envelope Status

```bash
ENVELOPE_ID="d1b03d9e-6d23-4f42-924d-3dcd77635989"

curl -X GET "$BASE_URI/restapi/v2.1/accounts/$ACCOUNT_ID/envelopes/$ENVELOPE_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Response:**
```json
{
  "envelopeId": "d1b03d9e-6d23-4f42-924d-3dcd77635989",
  "status": "sent",
  "statusDateTime": "2025-08-30T11:11:01.8230000Z",
  "createdDateTime": "2025-08-30T11:11:01.8230000Z",
  "sentDateTime": "2025-08-30T11:11:03.1730000Z",
  "deliveredDateTime": null,
  "completedDateTime": null,
  "voidedDateTime": null,
  "voidedReason": null,
  "deletedDateTime": null,
  "declinedDateTime": null,
  "emailSubject": "Please sign: CloudFuze Purchase Agreement",
  "emailBlurb": "This is a demo agreement for testing DocuSign integration. Please review and sign.",
  "signingLocation": null,
  "customFieldsUri": null,
  "notificationUri": null,
  "enableWetSign": "false",
  "allowMarkup": "false",
  "allowReassign": "true",
  "created": "2025-08-30T11:11:01.8230000Z",
  "lastModified": "2025-08-30T11:11:03.1730000Z",
  "delivered": null,
  "signed": null,
  "completed": null,
  "declined": null,
  "voided": null,
  "deleted": null,
  "sent": "2025-08-30T11:11:03.1730000Z",
  "documentsUri": "/restapi/v2.1/accounts/1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67/envelopes/d1b03d9e-6d23-4f42-924d-3dcd77635989/documents",
  "recipientsUri": "/restapi/v2.1/accounts/1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67/envelopes/d1b03d9e-6d23-4f42-924d-3dcd77635989/recipients",
  "attachmentsUri": "/restapi/v2.1/accounts/1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67/envelopes/d1b03d9e-6d23-4f42-924d-3dcd77635989/attachments",
  "envelopeUri": "/restapi/v2.1/accounts/1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67/envelopes/d1b03d9e-6d23-4f42-924d-3dcd77635989",
  "emailSettings": {
    "replyEmailAddressOverride": null,
    "replyEmailNameOverride": null,
    "bccEmailAddresses": []
  },
  "purgeState": "unpurged",
  "envelopeIdStamping": "true",
  "autoNavigation": "true",
  "isSignatureProviderEnvelope": "false",
  "anySigner": null,
  "envelopeLocation": null
}
```

## Step 6: Get Recipients Status

```bash
curl -X GET "$BASE_URI/restapi/v2.1/accounts/$ACCOUNT_ID/envelopes/$ENVELOPE_ID/recipients" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Response:**
```json
{
  "signers": [
    {
      "signatureInfo": {
        "signatureName": "",
        "signatureInitials": "",
        "fontStyle": ""
      },
      "deliveryMethod": "email",
      "recipientId": "1",
      "routingOrder": "1",
      "status": "sent",
      "totalTabCount": "1",
      "email": "Abhilasha.Kandakatla@cloudfuze.com",
      "name": "Abhilasha Kandakatla",
      "roleName": "",
      "sentDateTime": "2025-08-30T11:11:03.1730000Z",
      "deliveredDateTime": null,
      "signedDateTime": null,
      "declinedDateTime": null,
      "declineReason": null,
      "recipientType": "signer",
      "recipientIdGuid": "12345678-1234-1234-1234-123456789012",
      "requireIdLookup": "false",
      "requireUploadSignature": "false",
      "canEditRecipient": "true",
      "canSignRecipient": "true",
      "recipientSuppliesTabs": "false",
      "recipientCompleteCount": "0",
      "recipientInCompleteCount": "1",
      "recipientDeclineCount": "0",
      "recipientViewCount": "0",
      "recipientAuthenticationStatus": {
        "accessCodeResult": {
          "status": "Passed",
          "statusMetadata": {
            "result": "Passed"
          }
        },
        "idQuestionsResult": {
          "status": "Passed",
          "statusMetadata": {
            "result": "Passed"
          }
        },
        "idLookupResult": {
          "status": "Passed",
          "statusMetadata": {
            "result": "Passed"
          }
        },
        "ageVerifyResult": {
          "status": "Passed",
          "statusMetadata": {
            "result": "Passed"
          }
        },
        "smsAuthResult": {
          "status": "Passed",
          "statusMetadata": {
            "result": "Passed"
          }
        }
      },
      "recipientLock": "unlocked",
      "isBulkRecipient": "false",
      "bulkRecipientsUri": "",
      "recipientUri": "/restapi/v2.1/accounts/1b1f5546-8a8c-4ec4-b03d-73a71c2c3b67/envelopes/d1b03d9e-6d23-4f42-924d-3dcd77635989/recipients/1",
      "tabs": {
        "signHereTabs": [
          {
            "stampType": "signature",
            "name": "SignHere",
            "tabLabel": "SignHere",
            "scaleValue": "1",
            "optional": "false",
            "documentId": "1",
            "recipientId": "1",
            "pageNumber": "1",
            "xPosition": "100",
            "yPosition": "100",
            "anchorString": "Please review and sign",
            "anchorYOffset": "10",
            "anchorXOffset": "20",
            "anchorUnits": "pixels",
            "tabId": "12345678-1234-1234-1234-123456789012",
            "templateLocked": "false",
            "templateRequired": "false",
            "conditionalParentLabel": "",
            "conditionalParentValue": "",
            "conditionalTabLabel": "",
            "groupName": "",
            "groupLabel": "",
            "mergeField": {
              "configurationType": "",
              "path": "",
              "writeBack": "false",
              "allowSenderToEdit": "false",
              "font": "helvetica",
              "fontSize": "size11",
              "bold": "false",
              "italic": "false",
              "underline": "false",
              "fontColor": "black"
            },
            "tooltip": "",
            "tabOrder": "1",
            "tabGroupLabels": [
              "signer"
            ]
          }
        ]
      }
    }
  ],
  "agents": [],
  "editors": [],
  "intermediaries": [],
  "carbonCopies": [],
  "certifiedDeliveries": [],
  "inPersonSigners": [],
  "recipientCount": "1",
  "currentRoutingOrder": "1"
}
```

## Step 7: Download Document

```bash
curl -X GET "$BASE_URI/restapi/v2.1/accounts/$ACCOUNT_ID/envelopes/$ENVELOPE_ID/documents/1" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  --output "envelope-$ENVELOPE_ID-document.pdf"
```

## Step 8: Create Signing URL (Embedded Signing)

```bash
curl -X POST "$BASE_URI/restapi/v2.1/accounts/$ACCOUNT_ID/envelopes/$ENVELOPE_ID/views/recipient" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "returnUrl": "https://www.docusign.com/devcenter",
    "authenticationMethod": "none",
    "email": "Abhilasha.Kandakatla@cloudfuze.com",
    "userName": "Abhilasha Kandakatla",
    "clientUserId": "1"
  }'
```

**Response:**
```json
{
  "url": "https://demo.docusign.net/Member/StartInSession.aspx?t=12345678-1234-1234-1234-123456789012"
}
```

## Environment Switching

### Sandbox Environment
```bash
AUTH_SERVER="https://account-d.docusign.com"
BASE_URI="https://demo.docusign.net"
```

### Production Environment
```bash
AUTH_SERVER="https://account.docusign.com"
BASE_URI="https://na2.docusign.net"
```

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "invalid_grant",
  "error_description": "user_not_found"
}
```

**400 Bad Request:**
```json
{
  "errorCode": "UNKNOWN_ENVELOPE_RECIPIENT",
  "message": "The recipient you have identified is not a valid recipient of the specified envelope."
}
```

**403 Forbidden:**
```json
{
  "errorCode": "INSUFFICIENT_PERMISSIONS",
  "message": "This user lacks sufficient permissions to access this resource."
}
```

## Complete Workflow Script

```bash
#!/bin/bash

# DocuSign API Integration - Complete Workflow
# This script demonstrates the complete DocuSign integration workflow

set -e

echo "🚀 DocuSign API Integration - Complete Workflow"
echo "================================================"

# Configuration
INTEGRATION_KEY="81c782d7-b9d5-4890-a174-5932b9717174"
USER_ID="194a2f9c-4cda-41a0-a0ad-196d03a5c8e4"
AUTH_SERVER="https://account-d.docusign.com"
BASE_URI="https://demo.docusign.net"

echo "📋 Step 1: Configuration"
echo "   Integration Key: $INTEGRATION_KEY"
echo "   User ID: $USER_ID"
echo "   Environment: Sandbox"
echo ""

# Note: JWT generation requires a programming language with JWT library
# This is a simplified example - you'll need to generate the JWT token
echo "📋 Step 2: JWT Authentication"
echo "   Note: JWT token generation requires a programming language"
echo "   Use the Node.js example for complete JWT generation"
echo ""

echo "📋 Step 3: Send Document"
echo "   Use the cURL examples above to send documents"
echo ""

echo "📋 Step 4: Track Status"
echo "   Use the status checking examples above"
echo ""

echo "✅ Complete workflow examples provided!"
echo ""
echo "For production use:"
echo "1. Switch to production URLs"
echo "2. Implement proper error handling"
echo "3. Add retry logic for failed requests"
echo "4. Implement token refresh mechanism"
echo "5. Add logging and monitoring"
```

## Next Steps

1. **Generate JWT Token**: Use a programming language with JWT library
2. **Implement Error Handling**: Add retry logic and proper error responses
3. **Add Logging**: Implement comprehensive logging for debugging
4. **Production Deployment**: Switch to production URLs and add monitoring
5. **Security**: Store credentials securely and implement proper access controls

## Resources

- [DocuSign API Documentation](https://developers.docusign.com/)
- [JWT Authentication Guide](https://developers.docusign.com/platform/auth/jwt/)
- [Envelope API Reference](https://developers.docusign.com/esign-rest-api/reference/Envelopes/)
- [Recipients API Reference](https://developers.docusign.com/esign-rest-api/reference/Envelopes/EnvelopeRecipients/)
