import { useState } from 'react';

export default function Admin() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h1>Admin Page</h1>
      <input value="press me" type="button" onClick={() => setCount(count + 1)} />
      <p>This is some sample content for the page.</p>
      {count}
    </div>
  );
}
