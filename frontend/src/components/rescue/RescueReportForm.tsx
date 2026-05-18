import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { rescueApi } from "@/api/rescue";
import { ApiError } from "@/lib/api";

const rescueReportSchema = z.object({
  reporterName: z
    .string()
    .max(100, "Họ tên tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),
  reporterPhone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(20, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại chỉ chứa số và ký tự + - ( )"),
  locationText: z
    .string()
    .min(5, "Địa điểm tối thiểu 5 ký tự")
    .max(500, "Địa điểm tối đa 500 ký tự"),
  description: z
    .string()
    .max(2000, "Mô tả tối đa 2000 ký tự")
    .optional()
    .or(z.literal("")),
});

type RescueReportFormValues = z.infer<typeof rescueReportSchema>;

export const RescueReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const form = useForm<RescueReportFormValues>({
    resolver: zodResolver(rescueReportSchema),
    defaultValues: {
      reporterName: "",
      reporterPhone: "",
      locationText: "",
      description: "",
    },
  });

  const onSubmit = async (values: RescueReportFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await rescueApi.create({
        reporterName: values.reporterName || undefined,
        reporterPhone: values.reporterPhone,
        locationText: values.locationText,
        description: values.description || undefined,
      });

      const code = res.data?.trackingCode ?? "";

      toast.success("Đã gửi báo cáo cứu hộ thành công!", {
        description: `Mã tra cứu của bạn: ${code}`,
        duration: 5000,
      });

      setSubmittedCode(code);
      form.reset();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Không kết nối được tới server. Vui lòng thử lại hoặc gọi hotline.";
      toast.error("Gửi báo cáo thất bại", { description: message, duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedCode) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-10 text-center space-y-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-green-800">
          Đã gửi báo cáo thành công!
        </h3>
        <p className="text-green-700 max-w-md mx-auto">
          Đội cứu hộ của PawsHope sẽ liên hệ với bạn trong vòng 15 phút. Vui lòng giữ máy.
        </p>
        <div className="bg-white rounded-xl py-3 px-6 inline-block">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Mã tra cứu</p>
          <p className="text-2xl font-mono font-black text-[#2c5f51]">{submittedCode}</p>
        </div>
        <div>
          <Button
            onClick={() => setSubmittedCode(null)}
            className="rounded-full bg-[#f6931d] hover:bg-orange-600 mt-2"
          >
            Gửi báo cáo khác
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Họ và tên <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormDescription>
                Bạn có thể để trống nếu muốn ẩn danh.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reporterPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số điện thoại <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="0901234567"
                  type="tel"
                  inputMode="tel"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Đội cứu hộ sẽ gọi lại để xác nhận thông tin và tình trạng hiện tại.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Địa điểm phát hiện <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ví dụ: Đầu hẻm 234 Lê Văn Sỹ, Q.3, TP.HCM - dưới gầm xe ô tô màu đen"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Hãy ghi càng cụ thể càng tốt: tên đường, số nhà, hoặc các vật mốc gần đó.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mô tả tình trạng <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả về bé: chó/mèo, màu lông, đang bị thương ở đâu, có nguy hiểm không..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Thông tin chi tiết giúp đội cứu hộ chuẩn bị dụng cụ phù hợp.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="rounded-full bg-[#f6931d] hover:bg-orange-600 font-bold px-8 flex-1 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Đang gửi...
              </>
            ) : (
              <>
                <Send size={18} /> Gửi báo cáo cứu hộ
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => form.reset()}
            disabled={isSubmitting}
            className="rounded-full font-bold"
          >
            Làm mới
          </Button>
        </div>

        <p className="text-xs text-gray-500 pt-2 leading-relaxed">
          Bằng việc gửi báo cáo, bạn đồng ý cho phép PawsHope sử dụng các thông tin trên để liên hệ
          và xử lý ca cứu hộ. Chúng tôi cam kết bảo mật theo Chính sách bảo mật của tổ chức.
        </p>
      </form>
    </Form>
  );
};
