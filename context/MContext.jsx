"use client";

import { createContext, useState } from "react";

export const MContext = createContext({
  msg: [],
  setMsg: () => []
});
