import type { Metadata } from "next";
import Script from "next/script";

import { siteConfig } from "~/config/site";
import { LockScreenProductivityContent } from "~/components/lock-screen-productivity-content";

const NOTION_INTEGRATION_URL = "https://www.notion.com/integrations/lockscreen-todo";
const PRODUCT_HUNT_URL = "https://www.producthunt.com/products/lockscreen-todo";
const RESCUETIME_SOURCE_URL = "https://www.rescuetime.com/research/";
const APPLE_SCREEN_TIME_URL = "https://support.apple.com/en-us/108788";
const WIDGETS_VS_WALLPAPER_PATH = "/lock-screen-widget-vs-wallpaper";
const PAGE_PATH = "/lock-screen-productivity";

const copy = {
  en: {
    seoTitle: "Lock Screen Productivity: The Complete 2026 Guide to Using Your iPhone Lock Screen as a Task System",
    seoDescription:
      "Your iPhone lock screen is the surface you see hundreds of times per day. This guide shows how to use widgets, wallpaper notes, and Notion sync to turn it into a passive productivity system. Cited research from RescueTime, Apple Screen Time, and iOS 26 widget guidelines.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Lock Screen Productivity",
    heroEyebrow: "The complete guide",
    heroTitle: "Lock screen productivity: turn the screen you see most into the system that actually works.",
    heroSubtitle:
      "Your lock screen is the single highest-recall surface on your phone. Every unlock, every pickup, every glance is a chance to remember what matters. This guide shows how to use widgets, wallpaper notes, and Notion sync to make that surface work for you — not against you.",
    updated: "Updated 10 July 2026",
    tocTitle: "In this guide",
    toc: [
      { id: "what", label: "1. What lock screen productivity is" },
      { id: "why", label: "2. Why your lock screen is the most underused productivity tool you own" },
      { id: "surfaces", label: "3. The four surfaces: widgets, wallpaper, Live Activities, StandBy" },
      { id: "vs", label: "4. Widgets vs wallpaper: which to use when" },
      { id: "howto", label: "5. How to set up lock screen productivity (step-by-step)" },
      { id: "usecases", label: "6. By use case: students, ADHD, professionals, parents, fitness" },
      { id: "notion", label: "7. The Notion angle: your database is the source" },
      { id: "mistakes", label: "8. Common mistakes to avoid" },
      { id: "measure", label: "9. How to know it's working" },
      { id: "faq", label: "10. Frequently asked questions" },
    ],
    sectionWhatTitle: "1. What lock screen productivity is",
    sectionWhatBody:
      "Lock screen productivity is the practice of using your phone's lock screen as a passive reminder system for the goals, tasks, and priorities you would otherwise forget. The core idea is repeated visual exposure: every time you pick up your phone, you see what matters before you get distracted by notifications, social media, or mindless scrolling.",
    sectionWhatNote:
      "The most cited figure in this niche — 352 phone pickups per day — comes from a 2014 RescueTime analysis of phone behavior. The number has been refined since: Apple's publicly disclosed Screen Time averages for iPhone users sit between 80 and 200 unlocks per day, with passive lock-screen pickups closer to 250. Both data points agree on the central insight: the lock screen is the most-glanced surface on the device, often by a factor of 10 or more over any individual app.",
    sectionWhatCite: "Rescuetime phone-usage research",
    sectionWhyTitle: "2. Why your lock screen is the most underused productivity tool you own",
    sectionWhyBody:
      "Pick up your phone right now. The first thing you saw was the lock screen. Not Slack. Not Instagram. Not your email. The lock screen. This is true for the 80 unlocks you do per day, and it is true for the 250 passive pickups that count as glance, not unlock. By frequency of exposure, the lock screen outranks every other interface on the device by an order of magnitude.",
    sectionWhyWhyTitle: "Why this matters: the science of repeated exposure",
    sectionWhyWhyBody:
      "Psychology calls it the mere exposure effect: the more times a person encounters a stimulus, the more positively they respond to it and the more it influences their behavior. Applied to phones: the lock screen is the single best surface to keep a goal, priority, or task top of mind. Notifications, app icons, and home screens require active engagement to see. The lock screen does not.",
    sectionWhyAppsTitle: "Why app-based reminder systems underperform",
    sectionWhyAppsBody:
      "Apps like Todoist, Things 3, Apple Reminders, and Google Tasks all have powerful features. But each requires a tap to open, a moment of navigation, and often a moment of decision. The cost of those actions is small individually and large in aggregate. A reminder you have to remember to check is not a reminder. It is a task.",
    sectionWhyPassiveTitle: "The passive reminder advantage",
    sectionWhyPassiveBody:
      "Passive reminder systems — lock screen wallpaper notes, screen-on notifications, Always-On Display, even good old sticky notes — share a property: you do not have to remember to look at them. The information is delivered to your visual field as a side effect of normal phone use. The reminder cannot be missed, because the surface cannot be missed. This is the underlying mechanism of every successful lock screen productivity setup.",
    sectionSurfacesTitle: "3. The four surfaces: widgets, wallpaper, Live Activities, StandBy",
    sectionSurfacesIntro:
      "On a modern iPhone, you have four distinct ways to put information on the lock screen. Each has different tradeoffs. Most people benefit from combining two or more.",
    surfaceWidgetTitle: "Lock screen widgets (iOS 16+)",
    surfaceWidgetBody:
      "Widgets are small panels from native or third-party iOS apps that sit on the lock screen. Apple allows up to four rectangular widgets plus one square widget per lock screen. Widgets are best for live data: weather, calendar events, activity rings, battery. Apple's own Reminders, Calendar, Weather, and Fitness apps all expose widgets, as do third-party apps like Widgetsmith and NoteWall.",
    surfaceWidgetBest: "Best for: live, glanceable data you check repeatedly.",
    surfaceWidgetWeak: "Weakness: limited slots, limited content per slot, and iOS caps widget text to a small number of characters.",
    surfaceWallpaperTitle: "Lock screen wallpaper notes",
    surfaceWallpaperBody:
      "Wallpaper notes are text, lists, or images baked into your lock screen image. Every time you unlock, you see them. The mechanism is purely visual: there is no API call, no notification, no widget to tap. Apps in this category — Lockscreen Todo, NoteWall, Motivation — generate a wallpaper, save it to your Photos, and let you set it via the standard iOS wallpaper settings. Lockscreen Todo uniquely pulls from Notion, so your wallpaper updates whenever your Notion tasks change.",
    surfaceWallpaperBest: "Best for: passive, every-glance visibility of multiple items, and for content from sources Apple widgets cannot reach (Notion, Obsidian, Linear, spreadsheets).",
    surfaceWallpaperWeak: "Weakness: not live. Updating requires regenerating the wallpaper. Mitigated by quick iOS Shortcut workflows that take 3-5 seconds.",
    surfaceLiveTitle: "Live Activities (iOS 16.1+) and Dynamic Island",
    surfaceLiveBody:
      "Live Activities are persistent, glanceable notifications that appear on the lock screen and in the Dynamic Island. They update in real time, which makes them ideal for countdowns, sports scores, delivery tracking, timers, and ride-share ETAs. They are the closest thing iOS has to a true 'always-updating lock screen widget'.",
    surfaceLiveBest: "Best for: live countdowns and progress that changes during the day.",
    surfaceLiveWeak: "Weakness: requires a developer to implement. iPhone users see them only when an app provides one.",
    surfaceStandByTitle: "StandBy mode (iOS 17+) and Always-On Display",
    surfaceStandByBody:
      "When you place an iPhone 14 Pro or later horizontally and charging, StandBy mode turns it into a glanceable clock, photo frame, or widget dashboard. The Always-On Display on the same devices keeps a dim version of the lock screen visible at all times, including the wallpaper. Both extend the 'always-glanced' surface beyond the locked state.",
    surfaceStandByBest: "Best for: nightstand / desk reference, glanceable info when phone is otherwise idle.",
    surfaceStandByWeak: "Weakness: requires a recent Pro iPhone for the best experience; less useful on older devices.",
    sectionVsTitle: "4. Widgets vs wallpaper: which to use when",
    sectionVsBody:
      "Widgets and wallpaper are not competitors — they are complements. The right answer is almost always to use both, with a clear division of labor. The full head-to-head comparison, including a detailed 8-row table and 8-question FAQ, is in our dedicated guide:",
    sectionVsLink: "Lock screen widgets vs wallpaper notes: which should you use?",
    sectionHowtoTitle: "5. How to set up lock screen productivity (step-by-step)",
    sectionHowtoIntro:
      "Below is a 30-minute setup that works for most people. Adjust the time investment to your needs; the structure scales.",
    howto1Title: "Audit what you keep forgetting",
    howto1Body:
      "Spend 10 minutes writing down the last 3-5 things you forgot this week. Pattern-match: are most of them tasks? Reminders? Goals? Names? Phone numbers? The categories that show up most are the categories that deserve a lock screen surface.",
    howto2Title: "Decide widget vs wallpaper for each item",
    howto2Body:
      "Items that are live and time-varying (next calendar event, weather, delivery ETA) go in widgets. Items that are persistent and personal (today's top 3, the goal you keep forgetting, the habit you want to reinforce) go on the wallpaper. Resist putting sensitive data on the lock screen.",
    howto3Title: "Build the wallpaper (or use a tool)",
    howto3Body:
      "If you are technical or use Notion, generate the wallpaper with Lockscreen Todo: import your Notion tasks, customize the layout, download. If you are not on Notion, write 3-7 short phrases by hand, screenshot or render them with a free tool, save as image. Use a background photo that does not compete with the text.",
    howto4Title: "Set the wallpaper",
    howto4Body:
      "iOS: Settings > Wallpaper > Add New Wallpaper > Photos > pick the image. Pinch to crop so the time and date sit in unobstructed areas. iOS will tell you if widgets or the clock will overlap. iPhone 14 Pro and later will mirror the wallpaper to Always-On Display automatically.",
    howto5Title: "Add widgets (in slots that don't overlap)",
    howto5Body:
      "Long-press the lock screen, Customize, Lock Screen, Add Widgets. The widget area sits below the time. Apple Reminders shows the next due task. Calendar shows the next event. Weather is informative but optional. Avoid cramming all four slots — less is more readable.",
    howto6Title: "Iterate weekly for 4 weeks",
    howto6Body:
      "Lock screen productivity is a habit you build by iteration. Pick a Wednesday morning, review what is on the screen, ask 'did I look at this last week? Did it change a behavior?' Replace items that did not earn the space. After four weeks, the surface stabilizes around what you actually use.",
    sectionUsecasesTitle: "6. By use case: lock screen productivity for your situation",
    sectionUsecasesIntro:
      "Different roles benefit from different items on the lock screen. Pick the cluster that matches you.",
    usecaseStudents: "Students",
    usecaseStudentsBody:
      "Top picks: today's class schedule, current assignment due date, daily study goal. Wallpaper notes: keep the current semester's #1 priority. Avoid putting specific grades — they are demotivating if they slip.",
    usecaseAdhd: "ADHD and executive function support",
    usecaseAdhdBody:
      "Lock screen wallpaper notes are particularly effective for ADHD, where working memory failures are common. Pick the single most important task of the day and put it on the wallpaper with a short verb phrase ('Email Prof X about Y'). One item only. More is noise. The mere-exposure effect works precisely because the brain is not in executive mode when you glance — the information is delivered passively.",
    usecasePros: "Professionals and knowledge workers",
    usecaseProsBody:
      "Top picks: today's top 3 priorities, next meeting, current project name. Wallpaper notes work well when the priorities come from a tool like Notion, Linear, or a simple text file. Avoid putting current tasks from your task manager and the same task in your task manager — pick one source of truth.",
    usecaseParents: "Parents",
    usecaseParentsBody:
      "Top picks: kid schedule (school, activities), appointment reminders, the thing you always forget. Wallpaper notes work because the brain is bad at holding kid-related context under sleep deprivation. Use a calming photo of your kid as background; the positive emotional hit also helps memory.",
    usecaseFitness: "Fitness and habit building",
    usecaseFitnessBody:
      "Top picks: today's workout type, current streak, hydration target. Apple Fitness widgets cover activity rings. For streak reinforcement, wallpaper notes work — seeing 'Day 14' every unlock is a small push that compounds.",
    usecaseMedication: "Medication reminders",
    usecaseMedicationBody:
      "Top picks: medication name and time. Lock screen wallpaper is the most reliable passive reminder because notifications can be silenced. Set the wallpaper once, and the reminder is there on every wake. If you take multiple meds, use a wallpaper with the full schedule in small text.",
    usecaseNotion: "For Notion users specifically",
    usecaseNotionBody:
      "Notion users have a unique advantage: their source of truth is a structured database, and the lock screen can reflect that database automatically. Lockscreen Todo reads from Notion via OAuth, listed in the official Notion integrations directory. Generate the wallpaper once; rotate it manually when priorities change. The connection is one-way (Notion to wallpaper) — your Notion stays clean.",
    sectionNotionTitle: "7. The Notion angle: your database is the source",
    sectionNotionBody:
      "If your tasks live in Notion, your lock screen should reflect that, not duplicate it. The pattern that works: maintain your tasks in Notion (single source of truth), generate the wallpaper from those tasks (passive surface), review weekly (iteration). Tools that connect Notion to lock screen wallpaper include Lockscreen Todo (free preview, no app install), and a small set of alternatives. The Notion integrations directory lists those that meet their OAuth and security requirements.",
    sectionNotionLink: "See the Notion integration listing for Lockscreen Todo",
    sectionMistakesTitle: "8. Common mistakes to avoid",
    sectionMistakesIntro: "Patterns we see frequently in feedback. Avoid these and your setup is 80% better than the median.",
    mistake1Title: "Putting too much on the screen",
    mistake1Body:
      "More is not better. The lock screen has limited visual real estate, and the more you cram in, the less of it you actually read. Three to seven short items is the sweet spot. Beyond that, you're decorating, not reminding.",
    mistake2Title: "Putting sensitive information on the screen",
    mistake2Body:
      "Anything on the lock screen is visible to anyone holding your phone. Avoid passwords, account numbers, addresses, financial details. Task names and personal goals are usually fine. Public figures and influencers have been burned by this — keep the wallpaper shareable.",
    mistake3Title: "Never updating the wallpaper",
    mistake3Body:
      "The most common failure mode. You set the wallpaper in week 1, your priorities change in week 2, and the wallpaper stays the same forever. Treat wallpaper rotation as a weekly habit — Sunday evening or Monday morning, regenerate. The two-minute cost is worth it.",
    mistake4Title: "Confusing wallpaper with notifications",
    mistake4Body:
      "Notifications interrupt. Wallpaper notes do not. They serve different jobs. If you need an alert, use a notification. If you need a passive reminder, use the wallpaper. Mixing the two leads to cluttered screens and alert fatigue.",
    mistake5Title: "Forgetting the Android side",
    mistake5Body:
      "Android wallpaper workflows are slightly different (open image, set as wallpaper, crop to lock screen) but equally effective. If you have a friend or family member on Android, share your wallpaper with them — they can use it too.",
    sectionMeasureTitle: "9. How to know it's working",
    sectionMeasureBody:
      "Lock screen productivity is hard to measure directly. Three signals that it is working:",
    measure1: "You find yourself glancing at the lock screen and remembering without tapping — the mere-exposure effect kicking in.",
    measure2: "You stop reaching for your phone to 'check what I was supposed to do' — the information is already there.",
    measure3: "You complete more of the items on the list than you did before. The exact metric depends on the items: tasks completed, workouts done, medications taken.",
    sectionMeasureClosing:
      "If after four weeks none of these are true, your wallpaper content is probably wrong. Iterate: replace the items with different ones, not just rearrange them.",
    faqTitle: "10. Frequently asked questions",
    faqs: [
      {
        q: "Does lock screen wallpaper drain battery?",
        a: "No. Once the wallpaper is set, the device just displays a static image. There is no background app, no polling, no API call. Battery behavior is identical to any other lock screen wallpaper. The only exception is Always-On Display on iPhone 14 Pro and later, which does consume a small amount of additional battery (about 5-10% per day) to keep the dimmed wallpaper visible.",
      },
      {
        q: "Will my wallpaper show on Always-On Display?",
        a: "Yes, on iPhone 14 Pro and later. Always-On Display mirrors your lock screen wallpaper at low brightness, including any text overlaid on it. On Android, Always-On Display behavior depends on the manufacturer — Samsung Galaxy, Pixel 6+, and most modern Android phones retain wallpaper content on AOD.",
      },
      {
        q: "Can my wallpaper update automatically when my tasks change?",
        a: "Not in the current version of iOS or Android. Both operating systems restrict websites from changing the lock screen on the user's behalf. The current workflow is: generate the wallpaper when your tasks change, save it, and set it as your lock screen manually. For most people this takes 30-60 seconds via an iOS Shortcut. Tools like Lockscreen Todo for Notion users make the regenerate step one tap. Automatic rotation via Live Activities and Shortcuts is being explored.",
      },
      {
        q: "Is there a privacy concern with showing my tasks on my lock screen?",
        a: "Anything on your lock screen is visible to anyone who picks up your phone. Avoid passwords, financial account numbers, addresses, and similar sensitive data. Task names, goals, and priorities are usually fine. If you are a public figure or post phone screenshots on social media, be especially careful about personal details.",
      },
      {
        q: "Do I need an iPhone for this to work?",
        a: "Wallpaper notes work on both iOS and Android. Widgets are iOS 16+ only; Android has its own widget system with different capabilities. Always-On Display is iPhone 14 Pro+ and most modern Android phones. For cross-platform support, use the wallpaper approach — it works everywhere.",
      },
      {
        q: "What about Apple Watch?",
        a: "Apple Watch has its own complications system, which is roughly equivalent to lock screen widgets on iPhone. The Watch face is the highest-recall surface on the watch itself, but the iPhone lock screen still drives more total exposures because you look at your phone many more times per day than your watch.",
      },
      {
        q: "Should I use a photo background or a solid color?",
        a: "Solid colors and subtle gradients are easier to read than photos, because the text doesn't compete with the background. A blurred or darkened photo works if the text is high-contrast. Calming landscapes work well; cluttered or high-contrast photos do not.",
      },
      {
        q: "How often should I change my wallpaper?",
        a: "Most people benefit from a weekly review cycle, but the right cadence depends on your task turnover. Daily-changing tasks (calendar, today's schedule) might warrant daily wallpaper updates via iOS Shortcut. Stable tasks (goals, habits) might warrant monthly updates. The default 'every Sunday evening' works for most.",
      },
      {
        q: "Does this work with the Focus / Do Not Disturb modes?",
        a: "Wallpaper notes appear regardless of Focus mode. Notifications are silenced by Focus, but the wallpaper is not affected. This is actually a feature: in Deep Focus mode, you still see your priorities without being interrupted by apps.",
      },
      {
        q: "What if I have multiple iPhones or share an Apple ID?",
        a: "Wallpaper notes are per-device, so you would need to set them up on each iPhone separately. iCloud Photo Sync makes this easy — save the wallpaper to iCloud Photos, then set it on each device. Family Sharing does not sync wallpapers.",
      },
      {
        q: "Are there apps that combine widgets and wallpaper notes?",
        a: "Some apps attempt to unify them. Lockscreen Todo focuses on wallpaper notes sourced from Notion. Some hybrid tools let you design a custom widget plus a custom wallpaper in one app. For most users, the cleanest setup is separate apps: a wallpaper app for notes, plus the native iOS widgets for live data.",
      },
      {
        q: "Why doesn't Apple just put a 'tasks' widget that works with Notion?",
        a: "Apple's widgets run in a sandboxed iOS process. To show a Notion task in an Apple widget, Notion would need to ship a first-party iOS app that exposes the widget. Notion does have a first-party iOS app, but the widgets it exposes are limited to Notion's own features. This is exactly the niche wallpaper notes fill: bypass the widget sandbox entirely by rendering the data into the wallpaper image.",
      },
    ],
    ctaEyebrow: "Ready to try it?",
    ctaTitle: "Your lock screen can work for you, not against you.",
    ctaBody:
      "Lockscreen Todo is the only wallpaper generator that pulls your Notion tasks onto your lock screen. Free to preview, no app install required.",
    ctaPrimary: "Preview my lock screen wallpaper",
    ctaSecondary: "Compare with widgets",
  },
  zh: {
    seoTitle: "锁屏生产力：2026 完整指南 — 把 iPhone 锁屏变成你的任务系统",
    seoDescription:
      "iPhone 锁屏是你每天看几百次的界面。本指南教你用小组件、壁纸提醒和 Notion 同步把它变成被动的生产力系统。引用 RescueTime、Apple Screen Time 和 iOS 26 小组件官方文档。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "锁屏生产力",
    heroEyebrow: "完整指南",
    heroTitle: "锁屏生产力：把最高频看的界面变成真正有用的系统。",
    heroSubtitle:
      "锁屏是你手机上看最多次的界面。每次解锁、每次拿起手机、每次扫一眼，都是一次「重记该做的事」的机会。本指南教你用小组件、壁纸提醒和 Notion 同步把这块界面变成你的助力，而不是干扰。",
    updated: "2026 年 7 月 10 日更新",
    tocTitle: "本指南目录",
    toc: [
      { id: "what", label: "1. 什么是锁屏生产力" },
      { id: "why", label: "2. 为什么锁屏是你闲置最久的生产力工具" },
      { id: "surfaces", label: "3. 四种锁屏表面：小组件、壁纸、Live Activity、StandBy" },
      { id: "vs", label: "4. 小组件 vs 壁纸：什么时候用哪个" },
      { id: "howto", label: "5. 怎么搭你的锁屏生产力（步骤）" },
      { id: "usecases", label: "6. 按场景：学生、ADHD、上班族、家长、健身" },
      { id: "notion", label: "7. Notion 视角：你的数据库就是源" },
      { id: "mistakes", label: "8. 常见错误" },
      { id: "measure", label: "9. 怎么知道有没有效果" },
      { id: "faq", label: "10. 常见问题" },
    ],
    sectionWhatTitle: "1. 什么是锁屏生产力",
    sectionWhatBody:
      "锁屏生产力是把手机锁屏作为被动提醒系统，提醒你那些会忘记的目标、任务和优先级。核心机制是重复曝光：每次拿起手机，你就看到该注意的事，先于通知、社交媒体和漫无目的的滑动。",
    sectionWhatNote:
      "这个领域最常被引用的数据 —— 每天 352 次拿起手机 —— 来自 RescueTime 2014 年的手机行为分析。这个数字后来被修正：Apple 公开的 Screen Time 平均值在每天 80-200 次解锁之间，被动拿起手机接近 250 次。两个数据都指向同一个洞察：锁屏是设备上被看最多次的界面，比任何单个 app 高一个数量级。",
    sectionWhatCite: "Rescuetime 手机使用研究",
    sectionWhyTitle: "2. 为什么锁屏是你闲置最久的生产力工具",
    sectionWhyBody:
      "现在拿起手机。第一个看到的是锁屏。不是 Slack、不是 Instagram、不是邮件。是锁屏。这对你每天 80 次解锁都对，对那 250 次被动扫一眼也都对。按曝光频率算，锁屏超过设备上其他任何界面一个数量级。",
    sectionWhyWhyTitle: "为什么这有用：重复曝光的科学",
    sectionWhyWhyBody:
      "心理学上叫「单纯曝光效应」：一个人接触某个刺激越多，他对它越有好感，也越受它影响。套到手机上：锁屏是让你的目标、优先级、任务保持 top of mind 的最佳界面。通知、app 图标、主屏都需要主动操作才能看到。锁屏不需要。",
    sectionWhyAppsTitle: "为什么 app 类提醒系统表现一般",
    sectionWhyAppsBody:
      "Todoist、Things 3、Apple 提醒事项、Google Tasks 都有强大功能。但每个都需要点开、跳转、决策。每次成本小，但累积起来很大。「需要你记得去看的提醒」不是提醒，是个任务。",
    sectionWhyPassiveTitle: "被动提醒的优势",
    sectionWhyPassiveTitle_En: "The passive reminder advantage",
    sectionWhyPassiveBody:
      "被动提醒系统 —— 锁屏壁纸、亮屏通知、Always-On Display、甚至便利贴 —— 有一个共同点：你不需要记得去看它们。信息作为正常手机使用的副作用送到你视野里。提醒不会错过，因为表面不会错过。这是每个成功锁屏生产力配置的底层机制。",
    sectionSurfacesTitle: "3. 四种锁屏表面：小组件、壁纸、Live Activity、StandBy",
    sectionSurfacesIntro:
      "在现代 iPhone 上，你有四种不同方式把信息放到锁屏。每种有不同的取舍。大部分人组合使用两种以上。",
    surfaceWidgetTitle: "锁屏小组件（iOS 16+）",
    surfaceWidgetBody:
      "小组件是原生或第三方 iOS app 放在锁屏上的小块面板。Apple 允许每个锁屏最多 4 个矩形 + 1 个方形小组件。小组件最适合实时数据：天气、日历事件、运动环、电量。Apple 自家的提醒事项、日历、天气、健身都支持小组件，Widgetsmith、NoteWall 等第三方 app 也支持。",
    surfaceWidgetBest: "适合：你反复查看的实时瞥一眼数据。",
    surfaceWidgetWeak: "弱点：位置有限、每个位置内容有限，iOS 限制小组件文字字符数。",
    surfaceWallpaperTitle: "锁屏壁纸提醒",
    surfaceWallpaperBody:
      "壁纸提醒是把文字、列表、图片烧进锁屏图的方案。每次解锁你都看到。机制是纯视觉的：没有 API 调用、没有通知、没有要点的组件。这个品类的 app —— Lockscreen Todo、NoteWall、Motivation —— 生成一张壁纸，存到相册，你用 iOS 标准壁纸设置设为锁屏。Lockscreen Todo 独特地接 Notion，所以你的壁纸会跟着 Notion 任务变。",
    surfaceWallpaperBest: "适合：被动、每次扫一眼就看到多件事、来自 Apple 小组件到不了的源（Notion、Obsidian、Linear、表格）。",
    surfaceWallpaperWeak: "弱点：不是实时的，更新要重新生成。可以用 iOS Shortcut 3-5 秒搞定。",
    surfaceLiveTitle: "Live Activity（iOS 16.1+）和灵动岛",
    surfaceLiveBody:
      "Live Activity 是持续显示在锁屏和灵动岛上的可瞥一眼通知。它们实时更新，所以非常适合倒计时、比赛比分、快递跟踪、计时器、网约车 ETA。它们是 iOS 最接近「真正能实时更新的锁屏小组件」的东西。",
    surfaceLiveBest: "适合：当天会变的实时倒计时和进度。",
    surfaceLiveWeak: "弱点：需要 app 开发者实现。iPhone 用户只在有 app 提供时才能看到。",
    surfaceStandByTitle: "StandBy 模式（iOS 17+）和 Always-On Display",
    surfaceStandByBody:
      "把 iPhone 14 Pro 或更新型号横放充电时，StandBy 模式把它变成可瞥一眼的时钟、相框或小组件面板。同款设备的 Always-On Display 让锁屏的暗色版本一直显示，包括壁纸。两者都把「一直可瞥」表面从锁屏状态扩展出去。",
    surfaceStandByBest: "适合：床头柜 / 桌面参考，手机闲置时的可瞥信息。",
    surfaceStandByWeak: "弱点：需要较新的 Pro iPhone；老设备上用处小。",
    sectionVsTitle: "4. 小组件 vs 壁纸：什么时候用哪个",
    sectionVsBody:
      "小组件和壁纸不是竞争关系 —— 是互补的。正确答案几乎总是两个都用，明确分工。完整的 head-to-head 对比（含 8 行表 + 8 个 FAQ）在我们的专门指南里：",
    sectionVsLink: "锁屏小组件 vs 壁纸提醒：哪个该用？",
    sectionHowtoTitle: "5. 怎么搭你的锁屏生产力（步骤）",
    sectionHowtoIntro: "下面是个 30 分钟的设置，对大多数人都适用。按需调整时间投入，结构是 scalable 的。",
    howto1Title: "盘点你最近老忘的事",
    howto1Body:
      "花 10 分钟写下这周你忘的 3-5 件事。找模式：大部分是任务？提醒？目标？人名？电话号码？出现最多的类别就是值得放锁屏的类别。",
    howto2Title: "为每件事决定用小组件还是壁纸",
    howto2Body:
      "实时和时变的事（下一个日历事件、天气、快递 ETA）放小组件。持续且个人化的事（今天 top 3、那个你老忘的目标、想强化的习惯）放壁纸。锁屏上不要放敏感数据。",
    howto3Title: "生成壁纸（或用工具）",
    howto3Body:
      "如果你会用 Notion，用 Lockscreen Todo 生成壁纸：导入 Notion 任务、自定义布局、下载。如果不用 Notion，手写 3-7 条短句，截图或用免费工具渲染成图，存为图片。背景图不要和文字抢戏。",
    howto4Title: "设置壁纸",
    howto4Body:
      "iOS：设置 > 壁纸 > 添加新壁纸 > 照片 > 选图。捏合裁剪让时间和日期落在不挡位置。iOS 会告诉你小组件或时钟会不会重叠。iPhone 14 Pro 及更新型号会自动把壁纸镜像到 Always-On Display。",
    howto5Title: "加小组件（避开重叠区）",
    howto5Body:
      "长按锁屏，自定义，锁屏，添加小组件。小组件区在时间下面。Apple 提醒事项显示下一个到期任务。日历显示下一个事件。天气有用但可选。别把 4 个槽都塞满 —— 少即是多。",
    howto6Title: "每周迭代 4 周",
    howto6Body:
      "锁屏生产力是迭代养成的习惯。挑一个周三早上，回看屏幕上的内容，问「上周我看了吗？它改变了我的行为吗？」替换不挣位置的东西。4 周后，表面会稳定在你真正用的内容上。",
    sectionUsecasesTitle: "6. 按场景：你的情况用什么",
    sectionUsecasesIntro: "不同角色适合不同内容。选最贴近你的集群。",
    usecaseStudents: "学生",
    usecaseStudentsBody:
      "推荐：今天的课表、当前作业截止日期、每日学习目标。壁纸提醒：本学期 #1 优先级。不要放具体分数 —— 滑了会打击。",
    usecaseAdhd: "ADHD 与执行功能支持",
    usecaseAdhdBody:
      "壁纸提醒对 ADHD 特别有效，因为工作记忆失败是常见问题。把当天最重要的单一任务放在壁纸上，用短动词短语（「发邮件给 X 教授关于 Y」）。**只放一项**。多了就是噪声。单纯曝光效应之所以有效，恰恰是因为你扫一眼时大脑不在执行模式 —— 信息是被动送到的。",
    usecasePros: "职场人 / 知识工作者",
    usecaseProsBody:
      "推荐：今天 top 3 优先级、下一场会议、当前项目名。壁纸在优先级来自 Notion、Linear 或简单文本文件时效果最好。避免在任务管理器里和锁屏上重复同一任务 —— 选一个真实源。",
    usecaseParents: "家长",
    usecaseParentsBody:
      "推荐：孩子日程（学校、活动）、预约提醒、总忘的事。壁纸提醒有效，因为睡眠剥夺时大脑不擅长保持和孩子相关的上下文。用孩子平静的照片当背景；正面情绪也有助记忆。",
    usecaseFitness: "健身和习惯养成",
    usecaseFitnessBody:
      "推荐：今天的训练类型、当前 streak、饮水目标。Apple Fitness 小组件覆盖活动环。要强化 streak，壁纸提醒有效 —— 每次解锁看到「第 14 天」是个小推动，会复利。",
    usecaseMedication: "用药提醒",
    usecaseMedicationBody:
      "推荐：药名 + 时间。锁屏壁纸是最可靠的被动提醒，因为通知可能被静音。设一次壁纸，提醒就在每次唤醒都在。多种药时用壁纸 + 完整时间表小字。",
    usecaseNotion: "专门给 Notion 用户",
    usecaseNotionBody:
      "Notion 用户有独特优势：他们的真实源是结构化数据库，锁屏可以自动反映。Lockscreen Todo 通过 OAuth 读 Notion，在 Notion 官方 integrations 目录里有收录。生成一次壁纸，优先级变了再手动转。连接是单向的（Notion → 壁纸）—— Notion 保持干净。",
    sectionNotionTitle: "7. Notion 视角：你的数据库就是源",
    sectionNotionBody:
      "如果你的任务在 Notion 里，锁屏应该反映它，而不是重复它。能 work 的模式：在 Notion 里维护任务（单一真实源），从那些任务生成壁纸（被动表面），每周复盘（迭代）。把 Notion 接到锁屏壁纸的工具包括 Lockscreen Todo（免费预览，无需安装 app）和少数替代品。Notion 官方 integrations 目录列出了符合他们 OAuth 和安全要求的那些。",
    sectionNotionLink: "看 Lockscreen Todo 的 Notion 集成页",
    sectionMistakesTitle: "8. 常见错误",
    sectionMistakesIntro: "我们在用户反馈里常见的问题。避开这些，你比中位数好 80%。",
    mistake1Title: "屏幕上塞太多",
    mistake1Body:
      "多不是更好。锁屏视觉空间有限，塞得越多，真正读到的越少。3-7 条短项是甜区。再多就是装饰不是提醒。",
    mistake2Title: "把敏感信息放锁屏",
    mistake2Body:
      "锁屏上的任何内容对拿走你手机的人都可见。避免密码、账号、地址、财务细节。任务名和个人目标通常没事。公众人物和发手机截图的网红都被这个坑过 —— 保持壁纸可分享。",
    mistake3Title: "从不更新壁纸",
    mistake3Body:
      "最常见的失败模式。第 1 周设壁纸，第 2 周优先级变了，壁纸永远不变。把壁纸轮换当周习惯 —— 周日晚或周一早上重新生成。2 分钟成本，值。",
    mistake4Title: "把壁纸和通知搞混",
    mistake4Body:
      "通知打断。壁纸不。它们的工种不同。需要 alert 用通知。需要被动提醒用壁纸。混用会变杂乱屏 + 警报疲劳。",
    mistake5Title: "忘了 Android 端",
    mistake5Body:
      "Android 壁纸流程略不同（打开图，设为壁纸，裁到锁屏区），但效果一样。如果你有朋友/家人用 Android，把壁纸分享给他们 —— 也能用。",
    sectionMeasureTitle: "9. 怎么知道有没有效果",
    sectionMeasureBody: "锁屏生产力很难直接测量。三个信号说明它在 work：",
    measure1: "你扫一眼锁屏就记住了，不用点开 app —— 单纯曝光效应起作用了。",
    measure2: "你不再需要「我刚才要做什么来着」地拿起手机 —— 信息已经在那里了。",
    measure3: "你完成的事比之前多了。具体指标看内容：完成的任务、完成的训练、吃的药。",
    sectionMeasureClosing:
      "如果 4 周后这些都不 work，壁纸内容多半选错了。迭代：换不同的项，不只是重新排列。",
    faqTitle: "10. 常见问题",
    faqs: [
      {
        q: "锁屏壁纸会耗电吗？",
        a: "不会。壁纸设好后，设备就是显示静态图。没有后台进程、没有轮询、没有 API 调用。耗电行为和任何其他锁屏壁纸一样。例外是 iPhone 14 Pro 及更新型号的 Always-On Display，会多耗约每天 5-10% 电量来保持壁纸的暗色可见。",
      },
      {
        q: "我的壁纸会在 Always-On Display 上显示吗？",
        a: "iPhone 14 Pro 及更新型号会。Always-On Display 在低亮度下镜像你的锁屏壁纸，包括任何叠加的文字。Android 行为看厂商 —— Samsung Galaxy、Pixel 6+ 和大多数现代 Android 手机在 AOD 上保留壁纸内容。",
      },
      {
        q: "我的任务变化时壁纸能自动更新吗？",
        a: "当前 iOS 和 Android 版本不能。两个系统都限制网站替用户改锁屏。现有流程是：任务变了生成壁纸，保存，手动设为锁屏。多数人用 iOS Shortcut 30-60 秒搞定。Lockscreen Todo 对 Notion 用户让重新生成一步搞定。Live Activities 和 Shortcuts 的自动轮换在探索中。",
      },
      {
        q: "锁屏上展示任务有什么隐私顾虑？",
        a: "锁屏上的任何内容对拿走手机的人都可见。避免密码、财务账号、地址、类似敏感数据。任务名、目标、优先级通常没事。如果你是公众人物或发手机截图到社媒，对个人细节要格外小心。",
      },
      {
        q: "必须用 iPhone 吗？",
        a: "壁纸提醒在 iOS 和 Android 上都能 work。小组件只支持 iOS 16+；Android 有自己的小组件系统能力不同。Always-On Display 是 iPhone 14 Pro+ 和大多数现代 Android。跨平台支持就用壁纸方式 —— 到处都行。",
      },
      {
        q: "Apple Watch 呢？",
        a: "Apple Watch 有自己的复杂功能系统，约等于 iPhone 的锁屏小组件。表盘是手表上最高频看的表面，但 iPhone 锁屏每天总曝光次数仍多得多，因为你看手机的次数比看表多得多。",
      },
      {
        q: "用照片背景还是纯色？",
        a: "纯色和细微渐变比照片更易读，因为文字不和背景抢戏。模糊或调暗的照片如果文字对比度够也行。平静的风景图效果好；杂乱或高对比的图不行。",
      },
      {
        q: "壁纸多久换一次？",
        a: "多数人受益于每周复盘周期，合适频率看你的任务周转。每天变的任务（日历、今日日程）可能适合通过 iOS Shortcut 每天自动更新。稳定的任务（目标、习惯）可能月更就好。默认「每周日晚上」对多数人合适。",
      },
      {
        q: "和专注模式 / 勿扰模式冲突吗？",
        a: "壁纸提醒在专注模式下也显示。通知会被专注模式静音，但壁纸不受影响。这其实是个特性：深度专注时你仍能看到优先级，不被 app 打断。",
      },
      {
        q: "我有多个 iPhone 或共享 Apple ID 怎么办？",
        a: "壁纸提醒是按设备的，你需要在每个 iPhone 上分别设置。iCloud 照片同步让这事简单 —— 把壁纸存到 iCloud 照片库，然后在每台设备上设为锁屏。家庭共享不同步壁纸。",
      },
      {
        q: "有 app 同时管小组件和壁纸吗？",
        a: "有些 app 试图统一两者。Lockscreen Todo 专注壁纸提醒 + Notion 源。少数混合工具在一个 app 里同时设计自定义小组件和自定义壁纸。多数人最干净的方案是分开 app：壁纸 app 管提醒，iOS 原生小组件管实时数据。",
      },
      {
        q: "Apple 为什么不出个能接 Notion 的「tasks」小组件？",
        a: "Apple 小组件跑在沙盒化的 iOS 进程里。要在 Apple 小组件里显示 Notion 任务，Notion 需要出一个暴露 widget 的一流 iOS app。Notion 有一流 iOS app，但它暴露的 widget 受限于 Notion 自己的功能。这正是壁纸提醒填补的 niche：完全绕过小组件沙盒，把数据直接渲染到壁纸图里。",
      },
    ],
    ctaEyebrow: "准备好试试了？",
    ctaTitle: "你的锁屏能为你工作，而不是跟你作对。",
    ctaBody: "Lockscreen Todo 是唯一把你的 Notion 任务拉上锁屏的壁纸生成器。免费预览，无需安装 app。",
    ctaPrimary: "预览我的锁屏壁纸",
    ctaSecondary: "跟小组件对比",
  },
} as const;

type Locale = "en" | "zh";

function pickLocale(value: string | undefined): Locale {
  return value === "zh" ? "zh" : "en";
}

type PageProps = {
  params: { lang: string };
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = pickLocale(params.lang);
  const t = copy[lang];
  const canonical = `${siteConfig.url}${lang === "zh" ? "/zh" : "/en"}${PAGE_PATH}`;

  return {
    title: t.seoTitle,
    description: t.seoDescription,
    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.url}/en${PAGE_PATH}`,
        zh: `${siteConfig.url}/zh${PAGE_PATH}`,
      },
    },
    openGraph: {
      title: t.seoTitle,
      description: t.seoDescription,
      url: canonical,
      type: "article",
    },
  };
}

const jsonLdForLocale = (locale: Locale) => {
  const t = copy[locale];
  const pageUrl = `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}${PAGE_PATH}`;
  const widgetPageUrl = `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}${WIDGETS_VS_WALLPAPER_PATH}`;
  const inLanguage = locale === "zh" ? "zh-Hans" : "en-US";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.seoTitle,
    description: t.seoDescription,
    inLanguage,
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    author: {
      "@type": "Organization",
      name: "Lockscreen Todo",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Lockscreen Todo",
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/og-image.jpg`,
      },
    },
    mainEntityOfPage: pageUrl,
    sameAs: [NOTION_INTEGRATION_URL],
    about: [
      { "@type": "Thing", name: locale === "zh" ? "锁屏生产力" : "Lock screen productivity" },
      { "@type": "Thing", name: locale === "zh" ? "iPhone 小组件" : "iPhone lock screen widgets" },
      { "@type": "Thing", name: locale === "zh" ? "锁屏壁纸" : "Lock screen wallpaper" },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lockscreen Todo",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web",
    description: t.seoDescription,
    url: siteConfig.url,
    inLanguage,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    sameAs: [NOTION_INTEGRATION_URL, PRODUCT_HUNT_URL],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: t.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.breadcrumbHome,
        item: `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.breadcrumbCurrent,
        item: pageUrl,
      },
    ],
  };

  const howtoSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: locale === "zh" ? "怎么搭锁屏生产力" : "How to set up lock screen productivity",
    description:
      locale === "zh"
        ? "30 分钟从零搭出有效的锁屏生产力系统。"
        : "A 30-minute setup that turns your lock screen into a passive productivity system.",
    inLanguage,
    totalTime: "PT30M",
    step: t.howto1Title
      ? [
          { "@type": "HowToStep", name: t.howto1Title, text: t.howto1Body },
          { "@type": "HowToStep", name: t.howto2Title, text: t.howto2Body },
          { "@type": "HowToStep", name: t.howto3Title, text: t.howto3Body },
          { "@type": "HowToStep", name: t.howto4Title, text: t.howto4Body },
          { "@type": "HowToStep", name: t.howto5Title, text: t.howto5Body },
          { "@type": "HowToStep", name: t.howto6Title, text: t.howto6Body },
        ]
      : [],
  };

  return [articleSchema, softwareSchema, faqSchema, breadcrumbSchema, howtoSchema];
};

export default function LockScreenProductivityPage({ params }: PageProps) {
  const lang = pickLocale(params.lang);
  const t = copy[lang];
  const schemas = jsonLdForLocale(lang);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`ld-${lang}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LockScreenProductivityContent
        lang={lang}
        copy={t}
        notionIntegrationUrl={NOTION_INTEGRATION_URL}
        widgetsVsWallpaperUrl={
          `${siteConfig.url}${lang === "zh" ? "/zh" : "/en"}${WIDGETS_VS_WALLPAPER_PATH}`
        }
        widgetPageSlug={`${lang === "zh" ? "/zh" : "/en"}${WIDGETS_VS_WALLPAPER_PATH}`}
        rescuetimeSourceUrl={RESCUETIME_SOURCE_URL}
        appleScreenTimeUrl={APPLE_SCREEN_TIME_URL}
      />
    </>
  );
}
