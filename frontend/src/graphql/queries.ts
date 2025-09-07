import { gql } from '@apollo/client';

// ユーザー一覧を取得するクエリ
export const GET_USERS = gql`
  query GetUsers($page: Int, $items: Int) {
    users(page: $page, items: $items) {
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
  }
`;

// 特定のユーザーを取得するクエリ
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
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
  }
`;

// 現在のユーザーのプロフィールを取得するクエリ
export const GET_CURRENT_USER_PROFILE = gql`
  query GetCurrentUserProfile {
    currentUserProfile {
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
  }
`;

// 投稿一覧を取得するクエリ
export const GET_POSTS = gql`
  query GetPosts($page: Int, $items: Int, $countryCode: String) {
    posts(page: $page, items: $items, countryCode: $countryCode) {
      id
      title
      content
      countryCode
      user {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// テストフィールドを取得するクエリ
export const GET_TEST_FIELD = gql`
  query GetTestField {
    testField
  }
`; 
// 国一覧を取得するクエリ
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
    }
  }
`;
