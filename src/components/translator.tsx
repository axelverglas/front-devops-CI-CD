import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  url: z.string().min(2, {
    message: "L'url est requis.",
  }),
  lang: z.string(),
});

const languages = [
  { code: "en", name: "Anglais" },
  { code: "fr", name: "Français" },
];

export default function Translator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { url, lang } = values;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, lang }),
        }
      );
      const data = await response.json();
      console.log(data);
      setLoading(false);
      form.reset();
      toast.success("La traduction a été effectuée avec succès.");
      setResult(data.translation);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Une erreur s'est produite lors de la traduction.");
    }
  }

  return (
    <section className="h-[calc(100vh-(3.5rem+6rem))] flex justify-center items-center">
      <div className="container max-w-lg flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien Youtube</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=r94vuvwUSkY"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              Envoyer
            </Button>
          </form>
        </Form>
        {loading && <p>Chargement...</p>}
        {result && (
          <div className="p-4 bg-primary/10 rounded-md">
            <p>{result}</p>
          </div>
        )}
      </div>
    </section>
  );
}
