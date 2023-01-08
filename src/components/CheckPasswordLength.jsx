import React, { useState } from 'react';

function CheckPasswordLength() {
  const [password, setPassword] = useState('');
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);

  function checkPasswordLength(password) {
    if (password.length >= 8) {
      setPasswordLengthValid(true);
    } else {
      setPasswordLengthValid(false);
    }
  }

  return (
    <div>
      <input
        type='password'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={() => checkPasswordLength(password)}>
        Check password length
      </button>
      {passwordLengthValid ? (
        <p>The password is long enough.</p>
      ) : (
        <p>The password is too short.</p>
      )}
    </div>
  );
}

export default CheckPasswordLength;
