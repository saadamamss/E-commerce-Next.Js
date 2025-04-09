import { prisma } from "@/prisma";
import Jwt from "jsonwebtoken";
import Link from "next/link";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = (await searchParams) as { token: string };

  const decode: any = await new Promise((resolve) =>
    Jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
      (error, decode) => {
        resolve(decode);
      }
    )
  );

  if (!decode?.userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                {/* <XCircle className="h-12 w-12 text-red-500" /> */}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              This verification link is invalid or has expired
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const verifyUser = await new Promise(async (resolve) => {
    try {
      const user = await prisma.user.update({
        where: { id: decode.userId as string },
        data: {
          emailVerified: new Date(),
        },
      });
      resolve(user);
    } catch (error) {
      resolve(false);
    }
  });

  if (!verifyUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-100 p-4 rounded-full">
                
                {/* <XCircle className="h-12 w-12 text-yellow-500" /> */}

              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an issue verifying your email. Please try again later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log(decode);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full opacity-75 animate-ping"></div>
              <div className="bg-green-100 p-4 rounded-full relative">
                {/* <CheckCircle className="h-12 w-12 text-green-500" /> */}
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-4">
            Hello <span className="font-semibold text-indigo-600">{verifyUser.email}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now access all features.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Continue to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}