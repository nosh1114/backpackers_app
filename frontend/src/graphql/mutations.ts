import { gql } from '@apollo/client';

// ユーザーを作成するミューテーション
export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(input: { name: $name, email: $email }) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

// プロフィールを更新するミューテーション
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($name: String, $email: String, $bio: String, $location: String, $website: String, $avatarUrl: String) {
    updateProfile(input: { name: $name, email: $email, bio: $bio, location: $location, website: $website, avatarUrl: $avatarUrl }) {
      user {
        id
        name
        email
        bio
        location
        website
        avatarUrl
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

// ログイン用ミューテーション
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        id
        name
        email
      }
      token
      errors
    }
  }
`;

// サインアップ用ミューテーション
export const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
    signup(input: { name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation }) {
      user {
        id
        name
        email
      }
      token
      errors
    }
  }
`;

// パスワードリセット要求用ミューテーション
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      success
      message
    }
  }
`;

// パスワードリセット実行用ミューテーション
export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!, $passwordConfirmation: String!) {
    resetPassword(input: { token: $token, password: $password, passwordConfirmation: $passwordConfirmation }) {
      success
      message
    }
  }
`; 