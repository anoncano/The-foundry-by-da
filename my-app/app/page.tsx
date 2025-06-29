export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-3xl">Welcome to Foundry</h1>
      <div className="flex gap-4">
        <a className="text-blue-500 underline" href="/login">Login</a>
        <a className="text-blue-500 underline" href="/signup">Sign Up</a>
      </div>
    </div>
  );
}
