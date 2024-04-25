"use client";

import { AddServicesUI } from "@/app/components/services/services.ui";
import React, { useState } from "react";
import { FindServicesApi } from "@/app/lib/actions/services/services.req";
import { IServices } from "@/app/types/interfaces";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Session } from "next-auth/types";


export default function ServicesClientPage({ session, initData }: { session: Session, initData: IServices[] }) {
  const [services, setServices] = useState<IServices[]>(initData);

  const handleFindServices = async () => {
    let find: IServices[] = await FindServicesApi();

    if (!find?.hasOwnProperty('StatusCode') && !find?.hasOwnProperty('message')) {
      setServices(find);
    }
  }

  return <main className="container mx-auto px-24 py-8">
    <div className="flex items-center justify-between">
      <p className="font-medium text-7xl">Services</p>
      <AddServicesUI handleFindServices={handleFindServices} />
    </div>


    {services.length > 0 ?
      <main className="grid grid-cols-3 gap-4">
        {services.map((item: IServices) => {
          return <Card className=" cursor-pointer">
            <CardHeader>
              <CardTitle>
                <p>{item.name}</p>
              </CardTitle>
              <CardDescription>
                {item?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4">
              <p className="font-bold text-2xl">{item.price}$ {item.person && '/ personne'}</p>
            </CardContent>
          </Card>
        })}
      </main>
      :
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-2xl text-neutral-500">Aucun service enregistrer...</p>
      </div>
    }

  </main>
}