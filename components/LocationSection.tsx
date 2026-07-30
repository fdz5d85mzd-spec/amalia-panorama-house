'use client';

import { useEffect, useState } from 'react';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';
import { TranslationKey } from '@/lib/i18n';
import { COORDS, GOOGLE_MAPS_EMBED_URL, GOOGLE_MAPS_DIRECTIONS_URL } from '@/lib/site';

type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
};

function weatherCodeInfo(code: number): { icon: string; labelKey: TranslationKey } {
  if (code === 0) return { icon: '☀️', labelKey: 'weather_clear' };
  if (code === 1 || code === 2) return { icon: '⛅', labelKey: 'weather_partly' };
  if (code === 3) return { icon: '☁️', labelKey: 'weather_cloudy' };
  if (code === 45 || code === 48) return { icon: '🌫️', labelKey: 'weather_fog' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: '🌧️', labelKey: 'weather_rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: '❄️', labelKey: 'weather_snow' };
  if ([95, 96, 99].includes(code)) return { icon: '⛈️', labelKey: 'weather_storm' };
  return { icon: '⛅', labelKey: 'weather_partly' };
}

export default function LocationSection() {
  const { t, lang } = useLanguage();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${COORDS.lat}&longitude=${COORDS.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    )
      .then((res) => {
        if (!res.ok) throw new Error('weather request failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          apparentTemperature: Math.round(data.current.apparent_temperature),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          time: data.current.time,
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const info = weather ? weatherCodeInfo(weather.weatherCode) : null;
  const updatedTime = weather
    ? new Date(weather.time).toLocaleTimeString(lang === 'el' ? 'el-GR' : lang, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <section id="location" className="bg-limestone-50">
      <TerraceDivider />

      <div className="container pb-24 sm:pb-32">
        <Reveal>
          <p className="eyebrow mb-4 text-olive">{t('location_eyebrow')}</p>
          <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t('location_h2_1')} <span className="italic text-copper">{t('location_h2_2')}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-sm border border-ink/10 bg-limestone-100/60 p-8">
              <div>
                <p className="eyebrow text-ink/40">{t('weather_eyebrow')}</p>
                <p className="mt-2 font-display text-xl">{t('weather_h2_1')} {t('weather_h2_2')}</p>
              </div>

              {error && <p className="mt-8 text-sm text-ink-soft/70">{t('weather_error')}</p>}

              {!error && !weather && (
                <p className="mt-8 text-sm text-ink-soft/70">{t('weather_loading')}</p>
              )}

              {weather && info && (
                <div className="mt-8">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl leading-none">{info.icon}</span>
                    <div>
                      <p className="font-display text-4xl">{weather.temperature}°C</p>
                      <p className="eyebrow mt-1 text-copper">{t(info.labelKey)}</p>
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6 text-sm">
                    <div>
                      <dt className="eyebrow text-ink/40">{t('weather_feels')}</dt>
                      <dd className="mt-1 font-body">{weather.apparentTemperature}°C</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-ink/40">{t('weather_wind')}</dt>
                      <dd className="mt-1 font-body">{weather.windSpeed} km/h</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-ink/40">{t('weather_humidity')}</dt>
                      <dd className="mt-1 font-body">{weather.humidity}%</dd>
                    </div>
                  </dl>

                  <p className="mt-6 text-xs text-ink-soft/50">
                    {t('weather_updated')} {updatedTime}
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full min-h-[20rem] overflow-hidden rounded-sm border border-ink/10">
              <iframe
                src={GOOGLE_MAPS_EMBED_URL}
                title="AmaLia PanoRama House — Google Maps"
                className="h-full min-h-[20rem] w-full grayscale-[15%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow mt-4 inline-block text-ink-soft/80 underline-offset-4 hover:underline"
            >
              {t('location_directions')} →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
