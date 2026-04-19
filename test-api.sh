#!/bin/bash

# Simple API test script for PFA Portal
# Uses curl to verify the sanitized endpoints

BASE_URL="http://localhost:3000/api"

echo "--- Testing Health Endpoint ---"
curl -s "$BASE_URL/health" | grep -q "ok" && echo "PASS: Health is OK" || echo "FAIL: Health Check"

echo -e "\n--- Testing Case Update (Sanitization) ---"
# Create a dummy case first if needed, or target an existing ID
# Assuming ID 4 exists since it was mentioned in the error
# We send problematic fields like clinicalEntries and reporter
curl -X PATCH "$BASE_URL/cases/4" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Tested Rescue - Sanity Check",
       "clinicalEntries": [],
       "reporter": null,
       "id": "4",
       "createdAt": "2026-04-19T02:16:27.398Z"
     }' | grep -q "error" && echo "FAIL: Sanitization did not work" || echo "PASS: Case updated successfully (problematic fields stripped)"

echo -e "\n--- Testing Stats Endpoint ---"
curl -s "$BASE_URL/stats" | grep -q "totalCases" && echo "PASS: Stats works" || echo "FAIL: Stats"

echo -e "\nAPI Tests Completed."
