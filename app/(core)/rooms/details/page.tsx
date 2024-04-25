"use server";
import React from "react";
import { redirect } from "next/navigation";


export default async function Page () {
  redirect("/rooms")

  return <div>
    <p className="text-7xl">Rooms</p>
  </div>
}