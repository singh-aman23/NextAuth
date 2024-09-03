import { logout } from '@/actions/auth-actions';
import classes from './layout.module.css';

export const metadata = {
    title : 'Next Auth',
    description : 'Next.js Authentication'
};

export default function AuthRootLayout({children}){
    return (
        <html lang = "en">
            <body>
            <header className = {classes.authHeader}>
                <p>Welcome back</p>
                <form action = {logout}>
                    <button>Logout</button>
                </form>
            </header>
            {children}
            </body>
        </html>
    );
}