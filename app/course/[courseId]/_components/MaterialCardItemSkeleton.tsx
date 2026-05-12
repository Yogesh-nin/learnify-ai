import React from 'react'

function MaterialCardItemSkeleton() {
  return (
    <div className="border shadow-md rounded-lg bg-gray-100 p-5 h-full flex flex-col items-center animate-pulse">
      
      {/* Icon Skeleton */}
      <div className="h-[50px] w-[50px] bg-gray-300 rounded-lg mb-3"></div>
      
      {/* Name Skeleton */}
      <div className="h-5 w-24 bg-gray-300 rounded mb-3"></div>
      
      {/* Description Skeleton */}
      <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
      <div className="h-3 w-3/4 bg-gray-200 rounded mb-5"></div>
      
      {/* Button Skeleton */}
      <div className="h-10 w-full bg-gray-300 rounded-lg mt-auto"></div>
    </div>
  )
}

export default MaterialCardItemSkeleton
