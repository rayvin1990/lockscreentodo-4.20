"use client";

import React from "react";

export function PricingComparisonTable() {
  return (
    <div className="w-full max-w-full px-4">
      <div className="bg-brand-card rounded-xl p-4 shadow-xl border border-gray-800">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">User Type</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">Background Styles</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">Image Upload</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">Customization</th>
              <th className="pb-3 text-gray-300 font-bold uppercase text-sm">Notes</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <td className="py-4 text-white">Free User</td>
              <td className="py-4 text-gray-300">12 styles</td>
              <td className="py-4 text-gray-300">Not available</td>
              <td className="py-4 text-gray-300">Limited</td>
              <td className="py-4 text-gray-300">3 generations per week</td>
            </tr>

            <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <td className="py-4 text-white">7-Day Trial</td>
              <td className="py-4 text-white font-bold">All styles</td>
              <td className="py-4 text-gray-300">Unlimited uploads</td>
              <td className="py-4 text-white font-bold">Unlimited</td>
              <td className="py-4 text-gray-300">Full access for 7 days</td>
            </tr>

            <tr className="hover:bg-gray-800 transition-colors">
              <td className="py-4 text-white font-bold text-brand-green">Pro User</td>
              <td className="py-4 text-white font-bold">All styles</td>
              <td className="py-4 text-white font-bold">Unlimited</td>
              <td className="py-4 text-white font-bold">Unlimited</td>
              <td className="py-4 text-gray-300">Everything unlimited</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}