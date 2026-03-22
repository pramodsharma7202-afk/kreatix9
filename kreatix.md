# Kreatix9 Platform Setup & Administration

This guide explains how to perform manual tasks for the platform, particularly around user management, until a full visual administration interface for roles is completed.

## Upgrading a User to Admin

To grant a user access to the `/admin` control panel, you must elevate their `role` directly inside MongoDB.

Follow these exact steps:

1. **Register the Account**
   First, register an account normally on the website via the `/register` page using the email address you want to make an admin.

2. **Connect to MongoDB**
   Open your database using **MongoDB Compass** (the desktop UI) or the **MongoDB Atlas** web interface.
   Connect using your `MONGODB_URI` connection string.

3. **Locate the User Document**
   - Open the **`test`** database (or your designated database name if changed).
   - Click on the **`users`** collection.
   - Find the document matching your email address.

4. **Modify the Role Field**
   - Edit the document.
   - Locate the `role` field. It will default to `"user"`.
   - Double-click `"user"` and change the string to `"admin"`.
   - Click **Update** or **Save** to apply the changes to the document.

5. **Re-Login**
   - Go back to your Kreatix9 website.
   - Log out if you are already logged in.
   - Log in again. The NextAuth session will re-fetch your credentials and update your active session token with the `admin` role.
   - You will now have access to navigate to `http://localhost:3000/admin`.

## User Roles
*   `user`: Default customer role. Can place orders and view history.
*   `seller`: Approved merchant. Can view the `/seller` dashboard and list products.
*   `admin`: Full access to the `/admin` dashboard.

---
*Note: Make sure your local server is running by typing `npm run dev` in the terminal for the application to be accessible.*
