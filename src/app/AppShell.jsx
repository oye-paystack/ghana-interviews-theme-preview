import styles from "./AppShell.module.css";

function AppShell({ children }) {
  return (
    <main className={styles.shell}>
      <div className={styles.page}>{children}</div>
    </main>
  );
}

export default AppShell;
