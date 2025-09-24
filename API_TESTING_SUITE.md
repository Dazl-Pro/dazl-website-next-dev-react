# 🧪 DAZL API TESTING SUITE
## Comprehensive Frontend-Backend Compatibility Testing

> **Purpose**: Validate all 79 API endpoints work exactly as the React frontend expects them to function.

---

## 🚀 QUICK TEST EXECUTION

### **Environment Setup**
```bash
# Set API base URL
export API_URL="http://localhost:8000/api"
export CONTENT_TYPE="Content-Type: application/json"
export AUTH_TOKEN=""  # Will be set after login
```

### **Test Execution Order**
```bash
# 1. Authentication Tests (Get tokens)
# 2. Profile Management Tests
# 3. Core Business Logic Tests
# 4. Edge Cases and Error Handling
```

---

## 🔐 AUTHENTICATION FLOW TESTS

### **Test 1: Realtor Registration**
```bash
curl -X POST "$API_URL/realtor/register" \
-H "$CONTENT_TYPE" \
-d '{
  "first_name": "Test",
  "last_name": "Realtor",
  "email": "test.realtor@dazl.com",
  "password": "password123",
  "confirm_password": "password123",
  "phone_number": "1234567890",
  "address": "123 Test St",
  "city_of_real_state_agency": "Test City",
  "state": "TX",
  "zip_code": "12345",
  "real_state_agency_name": "Test Agency",
  "membershipOption": "basic",
  "check_box": true
}'

# Expected Response:
# Status: 201
# Body: {"success": true, "data": {"realtor": {...}, "token": "...", "token_type": "bearer"}}
```

### **Test 2: Realtor Login**
```bash
curl -X POST "$API_URL/realtor/login" \
-H "$CONTENT_TYPE" \
-d '{
  "email": "test.realtor@dazl.com",
  "password": "password123"
}'

# Expected Response (CRITICAL - Must match frontend expectations):
# Status: 200
# Body: {"success": true, "data": {"id": 1, "token": "jwt...", ...}}
# Store token: export AUTH_TOKEN="Bearer jwt_token_here"
```

### **Test 3: Customer Registration**
```bash
curl -X POST "$API_URL/customer/register" \
-H "$CONTENT_TYPE" \
-d '{
  "first_name": "Test",
  "last_name": "Customer",
  "email": "test.customer@dazl.com",
  "password": "password123",
  "confirm_password": "password123",
  "phone_number": "1234567890",
  "zip_code": "12345",
  "check_box": true
}'

# Expected Response:
# Status: 201
# Body: {"success": true, "data": {"customer": {...}, "token": "...", "token_type": "bearer"}}
```

### **Test 4: Customer Login**
```bash
curl -X POST "$API_URL/customer/login" \
-H "$CONTENT_TYPE" \
-d '{
  "email": "test.customer@dazl.com",
  "password": "password123"
}'

# Expected Response Format (CRITICAL):
# Frontend expects: action.payload.data.id and action.payload.data.token
```

### **Test 5: Professional Registration**
```bash
curl -X POST "$API_URL/professional/register" \
-H "$CONTENT_TYPE" \
-H "Content-Type: multipart/form-data" \
-F "first_name=Test" \
-F "last_name=Professional" \
-F "email=test.pro@dazl.com" \
-F "password=password123" \
-F "confirm_password=password123" \
-F "phone_number=1234567890" \
-F "company_name=Test Company" \
-F "company_street_address=123 Company St" \
-F "company_city=Test City" \
-F "state=TX" \
-F "zip_code=12345" \
-F "years=5" \
-F "insurance=Test Insurance" \
-F "insurance_number=INS123" \
-F "insurance_contact_number=1234567890" \
-F "services=[1,2,3]" \
-F "check_box=true" \
-F "membershipOption=basic"

# Expected Response:
# Status: 201
# Body: {"success": true, "data": {"professional": {...}, "token": "...", "token_type": "bearer"}}
```

---

## 👤 PROFILE MANAGEMENT TESTS

### **Test 6: Customer Profile Update (CRITICAL - Was Missing)**
```bash
# Test with ID parameter (frontend expects this format)
curl -X POST "$API_URL/customer/update/1" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "first_name": "Updated",
  "last_name": "Customer",
  "phone_number": "9876543210",
  "email": "updated.customer@dazl.com"
}'

# Expected Response:
# Status: 200
# Body: {"success": true, "message": "Profile updated successfully", "data": {...}}
```

### **Test 7: Realtor Profile Update (CRITICAL - Check If Exists)**
```bash
# Frontend calls: /realtor/update/
curl -X POST "$API_URL/realtor/update/" \
-H "Authorization: $AUTH_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "first_name=Updated" \
-F "last_name=Realtor" \
-F "phone_number=9876543210"

# Expected Response:
# Status: 200
# Body: {"success": true, "message": "Profile updated successfully"}
```

### **Test 8: Change Password Tests**
```bash
# Customer Password Change
curl -X POST "$API_URL/customer/change_password" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "currentpassword": "password123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}'

# Realtor Password Change
curl -X POST "$API_URL/realtor/change_password" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "currentpassword": "password123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}'

# Expected Response:
# Status: 200
# Body: {"success": true, "message": "Password changed successfully"}
```

---

## 🏠 PHD REPORTS TESTING

### **Test 9: PHD Report House Data (Critical Business Logic)**
```bash
curl -X GET "$API_URL/home-diagnostic-reports/house-data?score=100&address=123%20Test%20St&first_name=John&last_name=Doe&client_email=john@test.com&type=1&year_built=2021&bedrooms=3&bathrooms=2&structure_type=1&lot_size=1000&location=123%20Test%20St&foundation_type=1&tax_accessed_value=250000&sale_date=2023-01-01&phone_number=1234567890" \
-H "Authorization: $AUTH_TOKEN"

# Expected Response:
# Status: 200
# Body: {"success": true, "data": {...}}
```

### **Test 10: PHD Report Creation**
```bash
curl -X POST "$API_URL/home-diagnostic-reports" \
-H "Authorization: $AUTH_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "client_first_name=John" \
-F "client_last_name=Doe" \
-F "client_email=john@test.com" \
-F "property_address=123 Test St" \
-F "report_data={...}"

# Expected Response:
# Status: 200
# Body: {"success": true, "data": {...}}
```

### **Test 11: PHD Report Retrieval**
```bash
# Get PHD reports for realtor
curl -X GET "$API_URL/home-diagnostic-reports/for-realtor" \
-H "Authorization: $AUTH_TOKEN"

# Get specific PHD report
curl -X GET "$API_URL/home-diagnostic-reports/for-realtor/1" \
-H "Authorization: $AUTH_TOKEN"

# CRITICAL TEST: Check if this endpoint exists
curl -X GET "$API_URL/home-diagnostic-reports-test/for-realtor/1" \
-H "Authorization: $AUTH_TOKEN"

# Expected Response:
# Status: 200
# Body: {"success": true, "data": {"reports": [...]}}
```

---

## 📊 PROJECT MANAGEMENT TESTING

### **Test 12: Project CRUD Operations**
```bash
# Create Project (Customer)
curl -X POST "$API_URL/projects" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "project_name": "Test Project",
  "project_description": "Test Description",
  "project_address": "123 Project St",
  "project_type": 1,
  "rooms": [1, 2, 3]
}'

# Get Projects
curl -X GET "$API_URL/projects" \
-H "Authorization: $AUTH_TOKEN"

# Get Customer Projects with Pagination (CRITICAL - Check Format)
curl -X GET "$API_URL/projects/customers/1/5" \
-H "Authorization: $AUTH_TOKEN"

# Expected Response:
# Status: 200
# Body: {"success": true, "data": [...]}
```

### **Test 13: Realtor Project Operations**
```bash
# Get Realtor Projects with Pagination
curl -X GET "$API_URL/realtorprojects/customers/1/5" \
-H "Authorization: $AUTH_TOKEN"

# Create Realtor Project
curl -X POST "$API_URL/realtorprojects" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "project_name": "Realtor Test Project",
  "client_name": "Test Client"
}'

# Expected Response:
# Status: 200
# Body: {"success": true, "data": [...]}
```

### **Test 14: Project Image Upload**
```bash
# Upload Project Images
curl -X POST "$API_URL/projectImages" \
-H "Authorization: $AUTH_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "images[]=@test-image1.jpg" \
-F "images[]=@test-image2.jpg" \
-F "project_id=1"

# Get Images (Frontend expects this)
curl -X POST "$API_URL/getImage" \
-H "Authorization: $AUTH_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "image=@test-image.jpg"

# Expected Response:
# Status: 200
# Body: {"success": true, "data": {...}}
```

---

## 🔄 UPDATE OPERATIONS TESTING (CRITICAL)

### **Test 15: Project Update Operations**
```bash
# CRITICAL: Check if these endpoints exist (Frontend calls them)

# Update PHD Report
curl -X PATCH "$API_URL/update-phpreport/1" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{"report_data": "updated data"}'

# Update Agent Report
curl -X POST "$API_URL/update-report/1" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{"report_data": "updated data"}'

# Update Home Diagnostic Report
curl -X POST "$API_URL/update-home-diagnostic-reports/1" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{"report_data": "updated data"}'

# Expected Responses:
# Status: 200 or 404 (if endpoints don't exist)
```

---

## 📧 COMMUNICATION TESTING (CRITICAL)

### **Test 16: Email Functionality**
```bash
# CRITICAL: Check if these endpoints exist (Frontend calls them)

# Send Test Note
curl -X POST "$API_URL/sendtestnote" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "recipient": "test@example.com",
  "message": "Test note message"
}'

# Send Test Mail (PDF)
curl -X POST "$API_URL/sendtestmail" \
-H "Authorization: $AUTH_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "firstName=John" \
-F "lastName=Doe" \
-F "email=john@test.com" \
-F "pdfData=@test-report.pdf"

# Expected Responses:
# Status: 200 or 404 (if endpoints don't exist)
```

---

## 🏢 PROFESSIONAL & COMPANY TESTING

### **Test 17: Company Profile Management**
```bash
# Get Company Profile
curl -X GET "$API_URL/company-from-professional?professional_id=1" \
-H "Authorization: $AUTH_TOKEN"

# Update Company Profile
curl -X POST "$API_URL/company-from-professional/update?name=Updated%20Company&company_city=New%20City&state=CA&phone=9876543210&address=456%20New%20St&years_in_business=10&email=updated@company.com&insurance_certificate=cert123&insurance_contact_number=1234567890&insurance_number=ins456" \
-H "Authorization: $AUTH_TOKEN"

# Expected Response:
# Status: 200
# Body: {"success": true, "message": "Company updated successfully"}
```

### **Test 18: Project Opportunities**
```bash
# Get Project Opportunities (Professional)
curl -X GET "$API_URL/project-opportunities/professionals/all" \
-H "Authorization: $AUTH_TOKEN"

# Create Bid on Project Opportunity
curl -X PATCH "$API_URL/project-opportunities/1" \
-H "$CONTENT_TYPE" \
-H "Authorization: $AUTH_TOKEN" \
-d '{
  "bid_amount": 5000,
  "estimated_completion": "2024-03-01",
  "notes": "Professional bid notes"
}'

# Expected Response:
# Status: 200
# Body: {"success": true, "data": {...}}
```

---

## 🗑️ DELETE OPERATIONS TESTING

### **Test 19: Delete Operations**
```bash
# CRITICAL: Check if these endpoints exist (Frontend calls them)

# Delete Customer Report
curl -X DELETE "$API_URL/delete-report/1" \
-H "Authorization: $AUTH_TOKEN"

# Delete Realtor Project
curl -X DELETE "$API_URL/realtor/project/1" \
-H "Authorization: $AUTH_TOKEN"

# Delete Professional Project with Room
curl -X DELETE "$API_URL/professional/project/1/2" \
-H "Authorization: $AUTH_TOKEN"

# Expected Responses:
# Status: 200 (success) or 404 (if endpoints don't exist)
```

---

## 🔍 LOOKUP DATA TESTING

### **Test 20: Reference Data Endpoints**
```bash
# Room Features
curl -X GET "$API_URL/roomsfeature/1" \
-H "Authorization: $AUTH_TOKEN"

# Service Types (Public)
curl -X GET "$API_URL/service-types"

# Countries (Public)
curl -X GET "$API_URL/countries"

# Cities (Public)
curl -X GET "$API_URL/cities"

# Features (Public)
curl -X GET "$API_URL/features"

# Expected Response:
# Status: 200
# Body: {"success": true, "data": [...]}
```

---

## 🚨 CRITICAL ERROR TESTING

### **Test 21: Authentication Failures**
```bash
# Test Invalid Credentials
curl -X POST "$API_URL/customer/login" \
-H "$CONTENT_TYPE" \
-d '{
  "email": "nonexistent@test.com",
  "password": "wrongpassword"
}'

# Expected Response:
# Status: 401
# Body: {"success": false, "message": "Invalid credentials"}
```

### **Test 22: Authorization Failures**
```bash
# Test Protected Endpoint Without Token
curl -X GET "$API_URL/projects"

# Expected Response:
# Status: 401
# Body: {"success": false, "message": "Unauthorized"}
```

### **Test 23: Validation Failures**
```bash
# Test Invalid Registration Data
curl -X POST "$API_URL/customer/register" \
-H "$CONTENT_TYPE" \
-d '{
  "first_name": "",
  "email": "invalid-email",
  "password": "123"
}'

# Expected Response:
# Status: 422
# Body: {"success": false, "message": "Validation errors", "errors": {...}}
```

---

## 📊 TEST RESULTS TEMPLATE

### **Endpoint Test Results**
```
✅ PASS: POST /realtor/register (Status: 201)
❌ FAIL: POST /realtor/update/ (Status: 404 - Endpoint Missing)
⚠️  ISSUE: POST /customer/login (Status: 200, but response format doesn't match frontend)
```

### **Critical Issues Found:**
- [ ] Missing `/realtor/update/` endpoint
- [ ] Missing `/update-phpreport/{id}` endpoint
- [ ] Missing `/sendtestnote` endpoint
- [ ] Missing `/sendtestmail` endpoint
- [ ] Response format mismatch in login endpoints
- [ ] Pagination format issues in project endpoints

### **Authentication Issues:**
- [ ] Login response format compatibility
- [ ] Token format compatibility
- [ ] Middleware authentication working correctly

### **Business Logic Issues:**
- [ ] PHD report creation workflow
- [ ] Project management CRUD operations
- [ ] Professional bidding system
- [ ] Email functionality

---

## 🎯 SUCCESS CRITERIA

### **Zero Breaking Changes:**
- ✅ All existing React API calls work without modification
- ✅ All authentication flows work as expected
- ✅ All error responses match frontend error handling
- ✅ All file uploads work with existing code

### **Performance Benchmarks:**
- 🚀 Authentication: < 500ms response time
- 🚀 CRUD Operations: < 1000ms response time
- 🚀 File Uploads: < 5000ms response time
- 🚀 Bulk Data Queries: < 2000ms response time

---

## 🔧 AUTOMATED TEST SCRIPT

```bash
#!/bin/bash
# Run complete API test suite
echo "🚀 Starting DAZL API Compatibility Test Suite..."

# Set environment
export API_URL="http://localhost:8000/api"
export RESULTS_FILE="api_test_results.txt"

# Clear previous results
> $RESULTS_FILE

# Run all tests and capture results
echo "Running authentication tests..." >> $RESULTS_FILE
# ... (All test commands above)

echo "✅ Testing complete. Results saved to $RESULTS_FILE"
```

**🎯 Execute this testing suite immediately after implementing the compatibility fixes to ensure zero breaking changes for the React frontend.**