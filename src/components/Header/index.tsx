import NextLink from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <NextLink href="/">
      <header className={styles.header}>
        <img src="/images/Logo.svg" alt="logo" />
      </header>
    </NextLink>
  );
}
