import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp, FileText, Shield, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckedItems = {
  all: boolean;
  personalInfo: boolean;
  usageTerms: boolean;
  marketingConsent: boolean;
};

type OpenSections = {
  personalInfo: boolean;
  usageTerms: boolean;
  marketingConsent: boolean;
};

const agreementItems = [
  {
    key: "personalInfo",
    label: "개인 정보 수집 및 이용",
    required: true,
    icon: Shield,
  },
  {
    key: "usageTerms",
    label: "매글 서비스 이용약관",
    required: true,
    icon: FileText,
  },
  {
    key: "marketingConsent",
    label: "마케팅 정보 수신 동의",
    required: false,
    icon: Mail,
  },
];

const SignupStep1: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({
    all: false,
    personalInfo: false,
    usageTerms: false,
    marketingConsent: false,
  });

  const [openSections, setOpenSections] = useState<OpenSections>({
    personalInfo: false,
    usageTerms: false,
    marketingConsent: false,
  });

  const handleCheck = (item: keyof CheckedItems, checked: boolean) => {
    setCheckedItems((prevState) => {
      const updatedState = { ...prevState, [item]: checked };

      if (item === "all") {
        return {
          all: checked,
          personalInfo: checked,
          usageTerms: checked,
          marketingConsent: checked,
        };
      }

      const allChecked = updatedState.personalInfo && updatedState.usageTerms;
      return {
        ...updatedState,
        all: allChecked && updatedState.marketingConsent,
      };
    });
  };

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const isNextButtonDisabled =
    !checkedItems.personalInfo || !checkedItems.usageTerms;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              약관 동의
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm font-medium text-gray-400">정보 입력</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            서비스 이용약관
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            매글 서비스 이용을 위해 약관에 동의해주세요
          </p>

          {/* 전체 동의 */}
          <button
            type="button"
            onClick={() => handleCheck("all", !checkedItems.all)}
            className={cn(
              "w-full p-4 rounded-xl border-2 mb-4 flex items-center gap-3 transition-all duration-200",
              checkedItems.all
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-violet-300"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                checkedItems.all
                  ? "bg-violet-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              )}
            >
              {checkedItems.all && <Check className="w-4 h-4" />}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              전체 동의하기
            </span>
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-700 my-4" />

          {/* 개별 동의 항목 */}
          <div className="space-y-3">
            {agreementItems.map((item) => {
              const Icon = item.icon;
              const isChecked = checkedItems[item.key as keyof CheckedItems];
              const isOpen = openSections[item.key as keyof OpenSections];

              return (
                <div key={item.key}>
                  <div
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-200",
                      isChecked
                        ? "border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-900/10"
                        : "border-gray-100 dark:border-gray-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          handleCheck(
                            item.key as keyof CheckedItems,
                            !isChecked
                          )
                        }
                        className="flex items-center gap-3 flex-1"
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-violet-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700"
                          )}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          <span
                            className={cn(
                              "font-medium",
                              item.required
                                ? "text-violet-600 dark:text-violet-400"
                                : "text-gray-400"
                            )}
                          >
                            {item.required ? "(필수)" : "(선택)"}
                          </span>{" "}
                          {item.label}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleSection(item.key as keyof OpenSections)
                        }
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          to="#"
                          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          약관 전문 보기 →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 다음 버튼 */}
          <div className="mt-8">
            <Link to={isNextButtonDisabled ? "#" : "/signupstep2"}>
              <Button
                variant="violet"
                size="xl"
                className="w-full rounded-xl font-semibold"
                disabled={isNextButtonDisabled}
              >
                다음 단계로
              </Button>
            </Link>
            {isNextButtonDisabled && (
              <p className="text-center text-sm text-gray-400 mt-3">
                필수 약관에 동의해주세요
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupStep1;
