/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export const Button = props => (
  <button
    {...props}
    css={css`
      background-color: #1f1d25;
      outline: none;
      cursor: pointer;
      font-weight: 700;
      color: #fff;
      letter-spacing: 1px;
      font-size: 14px;
      text-align: center;
      padding: 12px;
      text-transform: uppercase;
      &:hover {
        background-color: #8f6aff;
      }
    `}
  >
    {props.children}
  </button>
);
