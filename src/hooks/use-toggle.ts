"use client";
import { useState } from "react";

export default function useToggle(initialValue = false) {
  const [state, setState] = useState(initialValue);

  const isOn = state == true;
  const isOff = state == false;
  const on = () => setState(true);
  const off = () => setState(false);
  const toggle = () => setState(!state);
  return {
    isOn,
    isOpen: isOn,
    isShowing: isOn,
    isOff,
    isClosed: isOff,
    isHidden: isOff,
    on,
    off,
    open: on,
    close: off,
    show: on,
    hide: off,
    toggle,
  };
}
