"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/constants/site";
import { Sidebar } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-login.jpg')" }}
    >
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white/90 backdrop-blur">
        <CardContent>
          <div className="text-center mb-6">
            <img
              src="/nap-logo.png"
              alt="NAP WORKSPACE"
              className="h-20 mx-auto"
            />
            <h1 className="text-2xl font-bold text-black">
              {SITE_CONFIG.companyName}
            </h1>
          </div>

          <form className="space-y-4">
            <div>
              <Label className="mb-2 text-black" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                className="bg-white text-black border border-gray-300"
              />
            </div>

            <div>
              <Label className="mb-2 text-black" htmlFor="password">
                Mật khẩu
              </Label>
              {/* <input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                className="bg-white text-black border border-gray-300"
              /> */}
              <PasswordInput
                name="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-black border border-gray-300"
              />
            </div>

            <div className="text-right text-sm text-blue-600 cursor-pointer hover:underline">
              Quên mật khẩu?
            </div>

            <Button
              className="w-full mt-2 bg-[#111827] text-white hover:bg-[#111827] cursor-pointer"
              type="submit"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="text-sm text-center text-gray-500 mt-6">
            {SITE_CONFIG.copyright}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
