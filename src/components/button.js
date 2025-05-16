/** @jsxImportSource @emotion/react */
import Link from 'next/link'
import { css } from '@emotion/react'

const buttonStyles = css`
  display: block;
  border: none;
  outline: none;
  cursor: pointer;

  padding: 0.75em 1.5em;
  background: var(--grey-5);
  color: var(--grey-1);
  border-radius: 0.33em;

  border: none;

  transition: all 200ms ease;

  &:hover {
    background: var(--grey-4);
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--grey-4);
    color: var(--grey-2);
  }
`

const outlineButtonStyles = css`
  ${buttonStyles}

  background: var(--grey-1);
  color: var(--grey-4);
  border: 1px solid var(--grey-2);

  &:hover {
    background: var(--grey-1);
    border: 1px solid var(--grey-3);
  }

  &:disabled {
    background: var(--grey-1);
    color: var(--grey-2);

    &:hover {
      background: var(--grey-1);
      border: 1px solid var(--grey-2);
    }
  }
`

export default function Button(props) {
  if (props.outline) {
    let { outline, ...rest } = props

    return (
      <button css={outlineButtonStyles} {...rest}>
        {props.children}
      </button>
    )
  }
  return (
    <button css={buttonStyles} {...props}>
      {props.children}
    </button>
  )
}

export function LinkButton(props) {
  if (props.outline) {
    let { outline, ...rest } = props

    return (
      <Link {...rest}>
        <a
          css={css`
            ${outlineButtonStyles}
            display: inline-block;
          `}
        >
          {props.children}
        </a>
      </Link>
    )
  }
  return (
    <Link {...props}>
      <a
        css={css`
          ${buttonStyles}
          display: inline-block;
        `}
      >
        {props.children}
      </a>
    </Link>
  )
}

const iconButtonStyles = css`
  background: none;
  border: none;
  border-radius: 1rem;

  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;

  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background: var(--grey-2);
    opacity: 0.4;
  }

  &:disabled {
    background: none;
    cursor: not-allowed;
    opacity: 0.4;
  }
`

export function IconButton(props) {
  return (
    <button
      css={css`
        ${iconButtonStyles}
      `}
      {...props}
    >
      {props.children}
    </button>
  )
}

export function LinkIconButton(props) {
  return (
    <Link {...props}>
      <a
        css={css`
          ${iconButtonStyles}
          color: inherit;
        `}
        {...props}
      >
        {props.children}
      </a>
    </Link>
  )
}
