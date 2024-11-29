import React, { useEffect, useState } from 'react';
import { 
  verifyAuthRole, 
  testQuoteInsertion,
  testOrderInsertion,
  testReceiptInsertion,
  testCatalogAccess,
  testTemplateAccess,
  testPresetValuesAccess
} from '../../utils/authVerification';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
}

export function AuthVerification() {
  const [roleVerified, setRoleVerified] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      // Verify role first
      const roleResult = await verifyAuthRole();
      setRoleVerified(roleResult.verified);

      if (roleResult.verified) {
        const tests = [
          { name: 'Quote Creation', test: testQuoteInsertion },
          { name: 'Order Creation', test: testOrderInsertion },
          { name: 'Receipt Creation', test: testReceiptInsertion },
          { name: 'Catalog Access', test: testCatalogAccess },
          { name: 'Template Access', test: testTemplateAccess },
          { name: 'Preset Values Access', test: testPresetValuesAccess }
        ];

        const results = await Promise.all(
          tests.map(async ({ name, test }) => {
            const result = await test();
            return {
              name,
              success: result.success,
              error: result.error
            };
          })
        );

        setTestResults(results);
      }

      setLoading(false);
    }

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Running verification tests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Authentication Verification</h2>
      
      <div className="space-y-6">
        {/* Role Verification */}
        <div>
          <div className="flex items-center mb-2">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              roleVerified ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="font-medium">JWT Role Verification</span>
          </div>
          <div className={`text-sm ${roleVerified ? 'text-green-600' : 'text-red-600'}`}>
            {roleVerified ? 'Valid authentication token' : 'Invalid or missing role in token'}
          </div>
        </div>

        {/* Database Tests */}
        {roleVerified && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Database Access Tests</h3>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start">
                  <span className={`w-2 h-2 rounded-full mr-2 mt-1.5 ${
                    result.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    {result.error && (
                      <div className="text-sm text-red-600 mt-1">
                        {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Status</span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              roleVerified && testResults.every(r => r.success)
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {roleVerified && testResults.every(r => r.success)
                ? 'All Tests Passed'
                : 'Tests Failed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}