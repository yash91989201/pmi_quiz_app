"use client";
import { useState } from "react";

export default function useToggle(initialValue = false) {
  const [state, setState] = useState(initialValue);

  const on = () => setState(true);
  const off = () => setState(false);
  const toggle = () => setState(!state);
  return {
    isOn: state == true,
    isOpen: state == true,
    isShowing: state == true,
    on,
    off,
    open: on,
    close: off,
    show: on,
    hide: off,
    toggle,
  };
}
