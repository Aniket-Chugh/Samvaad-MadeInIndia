import React from 'react'

const RightSideBar = () => {
  return (
<aside className="hidden lg:block w-72 bg-white p-4 shadow h-screen sticky top-0">
          <h2 className="text-xl font-semibold mb-4">📢 Tips</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Use clear titles for your complaints.</li>
            <li>📷 Attach real photos for verification.</li>
            <li>🌐 Enable location for accuracy.</li>
            <li>🏅 Earn badges with trusted reports.</li>
          </ul>
        </aside>  )
}

export default RightSideBar
