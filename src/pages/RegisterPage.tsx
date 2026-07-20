import Layout from "../components/layout/Layout";

export function RegisterPage() {
  return (
    <Layout>
      <h1>إنشاء حساب جديد</h1>
      <form action="#" method="post">
        <div>
          <label htmlFor="name">الاسم الكامل</label>
          <input
            type="text"
            id="name"
            name="name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">كلمة المرور</label>
          <input
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        <div>
          <label htmlFor="role">نوع الحساب</label>
          <select id="role" name="role" required>
            <option value="buyer">مشترٍ</option>
            <option value="seller">بائع</option>
          </select>
        </div>
        <button type="submit">إنشاء حساب</button>
      </form>
    </Layout>
  );
}