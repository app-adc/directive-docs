<script setup lang="ts">
import type { IconName } from '@/ABC/bc-types'
import BcIcon from '@/ABC/components/BcIcon.vue'
import { computed, ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'

// Types
type MenuItem = {
    label: string
    icon: IconName
    path?: RouteLocationRaw
    selected?: boolean
    children?: MenuItem[]
    badge?: number | string
}

type PropsBcLayout = {
    title: string
    subtitle?: string
    icon?: IconName
    isSticky?: boolean
    loading?: boolean
    collapsed?: boolean
}

const props = withDefaults(defineProps<PropsBcLayout>(), {
    subtitle: '',
    icon: undefined,
    isSticky: false,
    loading: false,
    collapsed: false,
})

const emit = defineEmits<{
    (e: 'collapse'): void
}>()

// Composables
function useLayoutNavigation() {
    const router = useRouter()
    const isCollapsed = ref(false)
    const activeMenuItem = ref<string | null>(null)

    // ในส่วนของ menuList ใน bc_doc_layout.vue

    const menus = ref<MenuItem[]>([
        {
            label: 'ADC Directives',
            icon: 'Code',
            children: [
                {
                    label: 'Getting Started',
                    icon: 'Download',
                    path: '/bc/adc-directives#getting-started',
                },
                {
                    label: 'HTTP Utilities',
                    icon: 'Globe',
                    path: '/bc/adc-directives#http-utilities',
                },
                {
                    label: 'Array Functions',
                    icon: 'ListFilter',
                    path: '/bc/adc-directives#array-functions',
                },
                {
                    label: 'Object Functions',
                    icon: 'Package',
                    path: '/bc/adc-directives#object-functions',
                },
                {
                    label: 'Validation Functions',
                    icon: 'ShieldCheck',
                    path: '/bc/adc-directives#validation-functions',
                },
                {
                    label: 'Date Functions',
                    icon: 'Calendar',
                    path: '/bc/adc-directives#date-functions',
                },
                {
                    label: 'String Functions',
                    icon: 'Text',
                    path: '/bc/adc-directives#string-functions',
                },
                {
                    label: 'Number Functions',
                    icon: 'Hash',
                    path: '/bc/adc-directives#number-functions',
                },
                {
                    label: 'Process Functions',
                    icon: 'DatabaseZap',
                    path: '/bc/adc-directives#process-functions',
                },
                {
                    label: 'Function Composition',
                    icon: 'Code',
                    path: '/bc/adc-directives#function-composition',
                },
                {
                    label: 'Other Utilities',
                    icon: 'Bug',
                    path: '/bc/adc-directives#other-utilities',
                },
            ],
        },
    ])

    const handleMenuClick = (item: MenuItem) => {
        if (item.path) {
            activeMenuItem.value =
                typeof item.path === 'string' ? item.path : null
            router.push(item.path)
        }
    }

    const toggleCollapse = () => {
        isCollapsed.value = !isCollapsed.value
        emit('collapse')
    }

    // Computed values for dynamic classes
    const asideWidth = computed(() =>
        isCollapsed.value ? 'w-[4rem]' : 'w-[16rem]'
    )

    const headerClass = computed(() => ({
        'sticky top-0 z-10 bg-white shadow-sm': props.isSticky,
        'border-b border-border': true,
        'px-6 py-4': true,
    }))

    const menuItemClass = computed(() => (item: MenuItem) => ({
        'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-200':
            true,
        'hover:bg-slate-50 rounded-lg mx-2': true,
        'bg-primary/10 text-primary font-medium': item.selected,
        'text-slate-600': !item.selected,
    }))

    return {
        menus,
        isCollapsed,
        activeMenuItem,
        asideWidth,
        headerClass,
        menuItemClass,
        handleMenuClick,
        toggleCollapse,
    }
}

// Use the composable
const {
    menus,
    isCollapsed,
    asideWidth,
    headerClass,
    menuItemClass,
    handleMenuClick,
    toggleCollapse,
} = useLayoutNavigation()
</script>

<template>
    <div class="flex min-h-screen">
        <!-- Aside Menu -->
        <aside
            :class="[
                asideWidth,
                'border-r border-border bg-white transition-all duration-300',
            ]"
            class="fixed h-screen"
        >
            <!-- Header -->
            <div
                class="flex h-16 items-center justify-between px-4 border-b border-border"
            >
                <transition name="fade">
                    <div v-if="!isCollapsed" class="flex items-center gap-2">
                        <BcIcon name="Box" size="24" color="primary" />
                        <h1 class="text-lg font-bold text-slate-800">
                            {{ title }}
                        </h1>
                    </div>
                </transition>
                <button
                    @click="toggleCollapse"
                    class="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <BcIcon
                        :name="isCollapsed ? 'ChevronRight' : 'ChevronLeft'"
                        size="20"
                    />
                </button>
            </div>

            <!-- Navigation -->
            <nav
                class="flex flex-col py-4 space-y-1 h-[calc(100vh-4rem)] overflow-y-auto"
            >
                <template v-for="item in menus" :key="item.label">
                    <!-- Group with Children -->
                    <div v-if="item.children" class="space-y-1">
                        <div
                            v-if="!isCollapsed"
                            class="px-4 py-2 text-xs font-bold text-slate-400 uppercase"
                        >
                            {{ item.label }}
                        </div>
                        <router-link
                            v-for="child in item.children"
                            :key="child.label"
                            :to="child.path!"
                            :class="menuItemClass(child)"
                            @click="handleMenuClick(child)"
                        >
                            <BcIcon :name="child.icon" size="20" />
                            <transition name="fade">
                                <div
                                    v-if="!isCollapsed"
                                    class="flex items-center justify-between flex-1"
                                >
                                    <span class="text-sm">{{
                                        child.label
                                    }}</span>
                                    <span
                                        v-if="child.badge"
                                        class="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full"
                                    >
                                        {{ child.badge }}
                                    </span>
                                </div>
                            </transition>
                        </router-link>
                    </div>

                    <!-- Single Item -->
                    <router-link
                        v-else
                        :to="item.path!"
                        :class="menuItemClass(item)"
                        @click="handleMenuClick(item)"
                    >
                        <BcIcon :name="item.icon" size="20" />
                        <transition name="fade">
                            <span v-if="!isCollapsed" class="text-sm">{{
                                item.label
                            }}</span>
                        </transition>
                    </router-link>
                </template>
            </nav>
        </aside>

        <!-- Main Content -->
        <div
            :class="[
                isCollapsed ? 'ml-16' : 'ml-64',
                'flex-1 transition-all duration-300',
            ]"
        >
            <!-- Header -->
            <header :class="headerClass">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <BcIcon
                            v-if="icon"
                            :name="icon"
                            size="24"
                            class="text-slate-400"
                        />
                        <div>
                            <h1 class="text-xl font-bold text-slate-800">
                                {{ title }}
                            </h1>
                            <p
                                v-if="subtitle"
                                class="mt-1 text-sm text-slate-500"
                            >
                                {{ subtitle }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <slot name="actions" />
                    </div>
                </div>
                <slot name="header" />
            </header>

            <!-- Main Content -->
            <main
                class="p-6"
                :class="{ 'opacity-50 pointer-events-none': loading }"
            >
                <slot />
            </main>

            <!-- Footer -->
            <footer class="px-6 py-4 border-t border-border bg-white mt-auto">
                <slot name="footer">
                    <div class="text-sm text-slate-500 text-center">
                        © {{ new Date().getFullYear() }} ABC Components. All
                        rights reserved.
                    </div>
                </slot>
            </footer>
        </div>
    </div>
</template>

<style>
/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom Scrollbar */
nav {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}

nav::-webkit-scrollbar {
    width: 6px;
}

nav::-webkit-scrollbar-track {
    background: transparent;
}

nav::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 3px;
}

/* ปรับแต่ง scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* ปรับแต่ง card effect */
.shadow-lg {
    transition: transform 0.2s, box-shadow 0.2s;
}

/* ปรับแต่ง code blocks */
pre {
    font-family: 'Fira Code', monospace;
    padding: 1rem;
    border-radius: 0.5rem;
    tab-size: 2;
}

code {
    font-family: inherit;
}

.bg-slate-800 :deep(.bg-white) {
    --tw-bg-opacity: 0.9;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.bg-slate-800 :deep(.bg-white:hover) {
    --tw-bg-opacity: 1;
}
</style>
