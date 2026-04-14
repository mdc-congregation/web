import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login | Church Management System',
  description: 'Sign in to your church management dashboard',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-secondary-light px-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-lg shadow-xl border border-border overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">CONGREGATION</h1>
              <p className="text-blue-100 text-sm">Church Management System</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-8">
            <LoginForm />
          </div>

          {/* Footer Section */}
          <div className="bg-secondary-light/30 px-6 py-4 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Secure access to your church dashboard
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>For support, contact your administrator</p>
        </div>
      </div>
    </div>
  )
}
