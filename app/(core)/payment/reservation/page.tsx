"use server"

import { redirect } from "next/navigation";
import React from "react";

export default function Page() {

  redirect("/auth")
  
}
