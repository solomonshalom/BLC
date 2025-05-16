/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const Header = props => (
  <header
    css={css`
      display: flex;
      margin-bottom: 5rem;

      a:first-of-type {
        margin-left: auto;
      }

      a {
        display: block;
        text-decoration: none;
      }

      a,
      button {
        color: var(--grey-2);
        cursor: pointer;
        margin-right: 1.5rem;
        transition: all 200ms ease;
      }

      a:hover,
      button:hover {
        color: var(--grey-3);
      }

      button:last-of-type {
        margin-right: 0;
      }

      button {
        border: none;
        padding: 0;
        background: none;
      }
    `}
    {...props}
  >
    {props.children}
  </header>
)

export default Header
