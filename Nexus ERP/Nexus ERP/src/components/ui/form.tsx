import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { FormProvider } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  useFormField,
  FormField,
  FormItemContext,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form-utils.tsx";

const Form = FormProvider;

export {
  Form,
  useFormField,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
