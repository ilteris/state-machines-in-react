/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useRef, useEffect, useCallback } from "react";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import { TweenMax, Elastic } from "gsap";
import Mousetrap from "mousetrap";
import { Button } from "./Button";

/**
 * Final demo of a State Machine Component.
 * see https://gedd.ski/post/state-machines-in-react for more info
 */

/**
 * State Machine - the "brain"
 */
const menuMachine = Machine({
  initial: "closed",
  states: {
    closed: {
      on: {
        OPEN: "opening"
      }
    },
    opening: {
      invoke: {
        src: "openMenu",
        onDone: { target: "open" }
      },
      on: {
        CLOSE: "closing"
      }
    },
    open: {
      on: {
        CLOSE: "closing"
      }
    },
    closing: {
      invoke: {
        src: "closeMenu",
        onDone: { target: "closed" }
      },
      on: {
        OPEN: "opening"
      }
    }
  }
});

/**
 * React component - the "body"
 */
export const Menu = ({ setStatus }) => {
  const element = useRef();

  // services the machine can "invoke".
  // useCallback ensures that our services always using the latest props/state/refs
  // so long as we add them as deps.
  const openMenu = useCallback(
    (context, event) => {
      return new Promise(resolve => {
        TweenMax.to(element.current, 0.5, {
          x: 0,
          backdropFilter: "blur(2px)",
          ease: Elastic.easeOut.config(1, 1),
          onComplete: resolve
        });
      });
    },
    [element]
  );

  const closeMenu = useCallback(
    (context, event) => {
      return new Promise(resolve => {
        TweenMax.to(element.current, 0.5, {
          x: -290,
          backdropFilter: "blur(0px)",
          ease: Elastic.easeOut.config(1, 1),
          onComplete: resolve
        });
      });
    },
    [element]
  );

  const [current, send] = useMachine(menuMachine, {
    // configure the machine's services.
    // these have to return a promise for xstate to know when to
    // take the onDone transtiion
    services: {
      openMenu,
      closeMenu
    }
  });

  // keyboard shortcut for closing the menu
  useEffect(() => {
    const key = "esc";
    Mousetrap.bind(key, () => {
      send("CLOSE");
    });

    // effect cleanup
    return () => {
      Mousetrap.unbind(key);
    };
  }, [send]);

  // let the parent component know about new Menu state since it wants to know
  useEffect(() => {
    setStatus(current.value);
  }, [setStatus, current.value]);

  const nextMessage =
    current.matches("open") || current.matches("opening") ? "CLOSE" : "OPEN";

  let label = nextMessage === "OPEN" ? "open" : "close";

  return (
    <div
      ref={element}
      css={css`
        color: #fff;
        z-index: 9999;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 380px;
        transform: translateX(-290px);
        display: grid;
        grid-template-rows: 40px auto;
        align-content: start;
        justify-content: end;
        grid-row-gap: 10px;
        padding: 10px;
        background-color: rgba(30, 27, 47, 0.8);
      `}
    >
      <Button
        onClick={() => {
          // cause a transition to a new state
          send(nextMessage);
        }}
      >
        {label}
      </Button>
    </div>
  );
};
