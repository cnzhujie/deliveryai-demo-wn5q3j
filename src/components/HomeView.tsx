import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronRight, MapPin, QrCode, Sparkles, Users } from 'lucide-react'
import hotpot from '@/assets/hotpot.jpg'
import { Button } from '@/components/ui/button'
import { getProduct } from '@/data/menu'
import { money } from '@/lib/utils'
import type { Product } from '@/types'

const tableOptions = [
  { code: 'A08', areaKey: 'bind.area.hall', seats: 4 },
  { code: 'B12', areaKey: 'bind.area.booth', seats: 6 },
  { code: 'C06', areaKey: 'bind.area.room', seats: 4 },
  { code: 'D03', areaKey: 'bind.area.window', seats: 6 },
]

const recommendedDishIds = ['p1', 'p2', 'p3', 'p5']
const recommendedDishes = recommendedDishIds.map(getProduct).filter((product): product is Product => Boolean(product))

interface HomeViewProps { onBind: (table: string) => void }

export function HomeView({ onBind }: HomeViewProps) {
  const { t } = useTranslation()
  const [showTableHint, setShowTableHint] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-rice-100 paper-noise">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-chili-100 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:px-10">
        <section className="animate-rise">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-chili-500/20 bg-white/80 px-3 py-2 text-xs font-bold text-chili-600 shadow-sm">
            <Sparkles size={14} /> {t('common.concept_badge')}
          </div>
          <p className="mb-3 text-sm font-bold tracking-widest text-chili-500">{t('common.concept_en')}</p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl lg:text-6xl">
            {t('bind.title_l1')}<br /><span className="text-chili-500">{t('bind.title_l2')}</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-charcoal-500">{t('bind.desc')}</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm text-charcoal-700">
            {[t('bind.feature1'), t('bind.feature2'), t('bind.feature3')].map((item) => (
              <span key={item} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm"><Check size={15} className="text-chili-500" />{item}</span>
            ))}
          </div>
        </section>

        <section className="animate-rise rounded-3xl border border-white/80 bg-white/90 p-4 shadow-float backdrop-blur sm:p-6">
          <div className="relative mb-6 h-48 overflow-hidden rounded-2xl sm:h-56">
            <img src={hotpot} alt={t('bind.img_alt')} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
              <div><p className="text-xs opacity-80">{t('common.simulated_store')}</p><h2 className="text-xl font-bold">{t('common.store_name')}</h2></div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">{t('common.open')}</span>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-rice-100 p-4">
            <span className="rounded-xl bg-white p-3 text-chili-500 shadow-sm"><QrCode /></span>
            <div className="min-w-0 flex-1"><p className="font-bold text-charcoal-900">{t('bind.qr_title')}</p><p className="text-sm text-charcoal-500">{t('bind.qr_desc')}</p></div>
          </div>
          {recommendedDishes.length > 0 && (
            <div className="mb-5 rounded-3xl bg-rice-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-charcoal-700">
                    <Sparkles size={13} />{t('bind.recommend_badge')}
                  </span>
                  <h2 className="mt-3 text-xl font-extrabold text-charcoal-900">{t('bind.recommend_title')}</h2>
                  <p className="mt-1 text-sm leading-6 text-charcoal-500">{t('bind.recommend_desc')}</p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-chili-600 shadow-sm sm:inline-flex">{t('bind.recommend_cta')}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {recommendedDishes.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setShowTableHint(true)}
                    className="group overflow-hidden rounded-2xl border border-charcoal-900/5 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-chili-500/30 hover:shadow-card focus:outline-none focus:ring-4 focus:ring-chili-50"
                    aria-label={t('bind.recommend_card_aria', { dish: t(product.name) })}
                  >
                    <div className="relative h-24 overflow-hidden">
                      <img src={product.image} alt={t(product.name)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/45 to-transparent" />
                      {product.badge && <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[11px] font-extrabold text-charcoal-900">{t(product.badge)}</span>}
                    </div>
                    <div className="p-3">
                      <h3 className="font-extrabold text-charcoal-900">{t(product.name)}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-charcoal-500">{t(product.description)}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-lg font-extrabold text-chili-500">{money(product.price)} <small className="text-xs font-medium text-charcoal-500">{t('menu.from')}</small></p>
                        <span className="text-xs font-bold text-charcoal-500 group-hover:text-chili-500">{t('bind.recommend_cta')}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {showTableHint && (
                <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-chili-600 shadow-sm" role="status">
                  {t('bind.recommend_hint')}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {tableOptions.map(({ code, areaKey, seats }, index) => (
              <button key={code} onClick={() => onBind(code)} className="group rounded-2xl border border-charcoal-900/10 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-chili-500 hover:shadow-card">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-rice-100 text-sm font-extrabold text-chili-500">{index + 1}</span>
                <p className="font-bold text-charcoal-900">{code} · {t(areaKey)}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500"><Users size={13} /> {t('bind.seats', { count: seats })}</p>
                <ChevronRight size={17} className="ml-auto mt-2 text-charcoal-500 transition group-hover:translate-x-1 group-hover:text-chili-500" />
              </button>
            ))}
          </div>
          <Button onClick={() => onBind('A08')} className="mt-4 w-full"><MapPin size={17} />{t('bind.quick_enter')}</Button>
        </section>
      </div>
    </main>
  )
}
