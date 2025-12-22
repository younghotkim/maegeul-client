import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, LogIn, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SignupStep3: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">약관 동의</span>
          </div>
          <div className="w-12 h-0.5 bg-violet-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">정보 입력</span>
          </div>
          <div className="w-12 h-0.5 bg-violet-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              완료
            </span>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              회원가입 완료! 🎉
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              매글과 함께 나를 알아가는 여정을 시작해보세요
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-violet-600 dark:text-violet-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">
                글쓰기를 통해 나를 알아갈 준비가 되셨나요?
              </span>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <Link to="/home">
              <Button
                variant="violet-outline"
                size="xl"
                className="w-full rounded-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                홈으로
              </Button>
            </Link>
            <Link to="/mainlogin">
              <Button variant="violet" size="xl" className="w-full rounded-xl">
                <LogIn className="w-5 h-5 mr-2" />
                로그인
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupStep3;
