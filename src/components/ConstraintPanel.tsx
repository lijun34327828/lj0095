import React from 'react';
import { AlertTriangle, Users, Lightbulb, X, AlertCircle, CheckCircle2, Ban } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculator';
import { cn } from '@/lib/utils';

export const ConstraintPanel: React.FC = () => {
  const { constraints, params } = useCalculatorStore();
  const {
    isLossWarning,
    lossWarningMsg,
    isTrafficOverflow,
    trafficSuggestions,
    maxStoreCapacity,
    isTrafficRatioInvalid,
    trafficRatioSum,
    trafficRatioMsg,
    canIssueConclusion,
  } = constraints;

  const hasWarning = isLossWarning || isTrafficOverflow || isTrafficRatioInvalid;
  const hasCritical = isTrafficRatioInvalid;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
        <AlertTriangle size={20} className="text-amber-gold" />
        约束校验
      </h3>

      {/* 结论出具状态 */}
      <div
        className={cn(
          'rounded-xl p-4 border animate-slide-up',
          canIssueConclusion
            ? 'bg-success-green/10 border-success-green/30'
            : 'bg-warning-red/10 border-warning-red/40'
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex-shrink-0',
              canIssueConclusion ? 'text-success-green' : 'text-warning-red animate-breathe'
            )}
          >
            {canIssueConclusion ? (
              <CheckCircle2 size={22} />
            ) : (
              <Ban size={22} />
            )}
          </div>
          <div className="flex-1">
            <h4
              className={cn(
                'font-bold mb-1 text-base',
                canIssueConclusion ? 'text-success-green' : 'text-warning-red'
              )}
            >
              {canIssueConclusion ? '✓ 可出具最终结论' : '✕ 禁止出具最终结论'}
            </h4>
            <p
              className={cn(
                'text-sm',
                canIssueConclusion ? 'text-success-green/80' : 'text-warning-red/90'
              )}
            >
              {canIssueConclusion
                ? '所有约束校验通过，可出具测算结论'
                : trafficRatioMsg || '存在未通过的约束项'}
            </p>
          </div>
        </div>
      </div>

      {/* 客流占比校验 */}
      {isTrafficRatioInvalid && (
        <div className="bg-warning-red/10 border border-warning-red/40 rounded-xl p-5 animate-glow animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="text-warning-red mt-0.5 animate-breathe">
              <AlertCircle size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-warning-red font-bold mb-2 text-base">客流占比校验失败</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-navy-900/60 rounded-lg px-4 py-2 border border-warning-red/30">
                  <div className="text-[10px] text-navy-400 mb-0.5">当前合计</div>
                  <div className="text-warning-red font-mono font-bold text-xl">
                    {trafficRatioSum.toFixed(1)}%
                  </div>
                </div>
                <div className="text-warning-red text-2xl font-bold">≠</div>
                <div className="bg-navy-900/60 rounded-lg px-4 py-2 border border-success-green/30">
                  <div className="text-[10px] text-navy-400 mb-0.5">目标值</div>
                  <div className="text-success-green font-mono font-bold text-xl">100.0%</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-navy-400 mb-0.5">差值</div>
                  <div
                    className={cn(
                      'font-mono font-bold text-lg',
                      trafficRatioSum > 100 ? 'text-warning-red' : 'text-amber-gold'
                    )}
                  >
                    {trafficRatioSum > 100 ? '+' : ''}
                    {(trafficRatioSum - 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="p-3 bg-navy-900/50 rounded-lg">
                <p className="text-xs text-navy-400 mb-1">修正方案：</p>
                <ul className="text-sm text-navy-300 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-gold mt-0.5">•</span>
                    <span>点击品类面板「归一化占比」按钮自动修正</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-gold mt-0.5">•</span>
                    <span>手动调整各品类客流占比，使合计恰好等于100%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasWarning && (
        <div className="bg-success-green/10 border border-success-green/30 rounded-xl p-5 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="text-success-green mt-0.5">
              <X size={20} className="rotate-45" />
            </div>
            <div>
              <h4 className="text-success-green font-medium mb-1">参数配置正常</h4>
              <p className="text-navy-300 text-sm">当前参数组合未触发约束预警，活动可正常进行</p>
            </div>
          </div>
        </div>
      )}

      {isLossWarning && !hasCritical && (
        <div className="bg-warning-red/10 border border-warning-red/40 rounded-xl p-5 animate-glow animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="text-warning-red mt-0.5 animate-breathe">
              <AlertTriangle size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-warning-red font-bold mb-2 text-base">亏损预警</h4>
              <p className="text-warning-red/90 text-sm leading-relaxed">{lossWarningMsg}</p>
              <div className="mt-3 p-3 bg-navy-900/50 rounded-lg">
                <p className="text-xs text-navy-400 mb-1">优化建议：</p>
                <ul className="text-sm text-navy-300 space-y-1">
                  <li>• 降低折扣力度，减少让利金额</li>
                  <li>• 增加预估客流，摊薄固定成本</li>
                  <li>• 提高高毛利品类的客流占比</li>
                  <li>• 减少活动物料固定成本投入</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTrafficOverflow && (
        <div className="bg-amber-gold/10 border border-amber-gold/40 rounded-xl p-5 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="text-amber-gold mt-0.5">
              <Users size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-amber-gold font-bold mb-2 text-base">客流超限提示</h4>
              <p className="text-amber-gold/90 text-sm">
                预估客流 <span className="font-mono font-bold">{params.estimatedTraffic}</span> 人，
                门店接待上限 <span className="font-mono font-bold">{maxStoreCapacity}</span> 人
              </p>
              <div className="mt-3 p-3 bg-navy-900/50 rounded-lg">
                <p className="text-xs text-navy-400 mb-2 flex items-center gap-1">
                  <Lightbulb size={14} />
                  优化建议：
                </p>
                <ul className="text-sm text-navy-300 space-y-1.5">
                  {trafficSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-gold mt-0.5">•</span>
                      <span>{suggestion.replace(/^预估客流超出门店接待上限.*$/, () => 
                        `客流超出门店接待上限 ${(((params.estimatedTraffic - maxStoreCapacity) / maxStoreCapacity) * 100).toFixed(1)}%`
                      )}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
