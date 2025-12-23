import { TuitionData, PaymentData, UnpaidData } from '../types';

interface TuitionCardProps {
  data: TuitionData | PaymentData | UnpaidData;
  type: 'tuition_info' | 'payment_success' | 'unpaid_list';
}

export function TuitionCard({ data, type }: TuitionCardProps) {
  if (type === 'tuition_info') {
    const tuition = data as TuitionData;
    return (
      <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tuition Information</h3>
        <div className="space-y-2">
          {tuition.studentNo && (
            <div className="flex justify-between">
              <span className="text-gray-600">Student Number:</span>
              <span className="font-medium text-gray-900">{tuition.studentNo}</span>
            </div>
          )}
          {tuition.name && (
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">{tuition.name}</span>
            </div>
          )}
          {tuition.term && (
            <div className="flex justify-between">
              <span className="text-gray-600">Term:</span>
              <span className="font-medium text-gray-900">{tuition.term}</span>
            </div>
          )}
          {tuition.totalAmount !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-gray-900">{tuition.totalAmount.toLocaleString()} TRY</span>
            </div>
          )}
          {tuition.paidAmount !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Paid Amount:</span>
              <span className="font-medium text-green-600">{tuition.paidAmount.toLocaleString()} TRY</span>
            </div>
          )}
          {tuition.balance !== undefined && (
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-700 font-semibold">Balance Due:</span>
              <span className="font-bold text-red-600">{tuition.balance.toLocaleString()} TRY</span>
            </div>
          )}
          {tuition.status && (
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-medium px-2 py-1 rounded text-sm ${
                  tuition.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : tuition.status === 'PARTIAL'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {tuition.status}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'payment_success') {
    const payment = data as PaymentData;
    return (
      <div className="bg-green-50 rounded-xl shadow-md p-5 mb-4 border border-green-200">
        <div className="flex items-center mb-3">
          <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-semibold text-green-800">Payment Successful</h3>
        </div>
        <div className="space-y-2">
          {payment.amount !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-700">Amount Paid:</span>
              <span className="font-bold text-green-700">{payment.amount.toLocaleString()} TRY</span>
            </div>
          )}
          {payment.remainingBalance !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-700">Remaining Balance:</span>
              <span className="font-medium text-gray-900">{payment.remainingBalance.toLocaleString()} TRY</span>
            </div>
          )}
          {payment.transactionRef && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-gray-800">{payment.transactionRef}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'unpaid_list') {
    const unpaid = data as UnpaidData;
    return (
      <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Unpaid Tuition - {unpaid.term}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Student No</th>
                <th className="px-4 py-2 text-left text-gray-700">Name</th>
                <th className="px-4 py-2 text-right text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {unpaid.students?.map((student, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2 font-mono">{student.studentNo}</td>
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2 text-right font-medium text-red-600">
                    {student.balance.toLocaleString()} TRY
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {unpaid.totalCount !== undefined && (
          <p className="text-sm text-gray-600 mt-3">
            Total: {unpaid.totalCount} student{unpaid.totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  }

  return null;
}
