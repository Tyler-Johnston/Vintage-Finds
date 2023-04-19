import { useState } from 'react';

export default function MyNewPage() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Welcome to my new page!</h1>
      <input value="press me" type="button" onClick={() => setCount(count + 1)} />
      <p>This is some sample content for the page.</p>
      {count}
    </div>
  );
}
