import React from 'react';
import { signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import styled from 'styled-components';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;  // Fallback color
`;

const SignInButton = styled.button`
  background-color: #4285F4;  // Google blue
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357AE8;  // Darker blue on hover
  }
`;

interface AuthProps {
  onUserAuth: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onUserAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onUserAuth(result.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <AuthWrapper>
      <SignInButton onClick={signInWithGoogle}>
        Sign in with Google
      </SignInButton>
    </AuthWrapper>
  );
};

export default Auth;