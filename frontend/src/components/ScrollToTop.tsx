import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef<string>(pathname);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    // 初回マウント時は何もしない（ブラウザのデフォルト動作に任せる）
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // パスが変更された場合（新しいページに遷移した場合）
    if (prevPathnameRef.current !== pathname) {
      // 新しいページに遷移した時のみ最上部にスクロール
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior
      });
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  return null;
}

