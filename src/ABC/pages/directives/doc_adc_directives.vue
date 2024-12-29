<script setup lang="ts">
import BcButton from '@/ABC/components/BcButton.vue'
import BcIcon from '@/ABC/components/BcIcon.vue'
import BcInput from '@/ABC/components/BcInput.vue'
import BcLayout from '@/ABC/pages/bc_doc_layout.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
onMounted(() => {
    handleExampleChange('toCombineText')
})

// สำหรับ Interactive Playground
type ExampleKey = keyof typeof examples
const selectedExample = ref<ExampleKey>('toCombineText')
const codeInput = ref('')

// ตัวอย่างโค้ดสำหรับ playground
// ตัวอย่างโค้ดสำหรับ playground
const examples = {
    // Array Utilities
    mapArray: {
        template: `import { mapArray } from 'adc-directive'

const result = mapArray([1, [2, 3, [4, 5, [6]]]])
// Expected: [1, 2, 3, 4, 5, 6]`,
        description: 'แปลง nested array ให้เป็น flat array',
    },
    chunkArray: {
        template: `import { chunkArray } from 'adc-directive'

const result = chunkArray([1, 2, 3, 4, 5], 2)
// Expected: [[1,2], [3,4], [5]]`,
        description: 'แบ่ง array เป็นชุดตามจำนวนที่กำหนด',
    },
    checkItemDuplicate: {
        template: `import { checkItemDuplicate } from 'adc-directive'

const users = [
  { name: 'John', id: 1 },
  { name: 'John', id: 2 }
]
const result = checkItemDuplicate(users, user => user.name)
// Expected: true`,
        description: 'ตรวจสอบค่าซ้ำใน array',
    },
    toChangePositionArray: {
        template: `import { toChangePositionArray } from 'adc-directive'

const result = toChangePositionArray(['A', 'B', 'C'])
// Expected: ['B', 'C', 'A'] (random position)`,
        description: 'สลับตำแหน่งข้อมูลใน array แบบสุ่ม',
    },

    // String Utilities
    toCombineText: {
        template: `import { toCombineText } from 'adc-directive'

const result = toCombineText(['a', 'b', null, 'c'], '_')
// Expected: a_b_c`,
        description: 'รวม Array เป็น string ด้วยตัวคั่นที่กำหนด',
    },
    toHasKey: {
        template: `import { toHasKey } from 'adc-directive'

const result = toHasKey('User-Name__123 !@#')
// Expected: username_123`,
        description: 'ลบอักขระพิเศษและช่องว่าง เหมาะสำหรับใช้เป็น key',
    },
    toReplaceTextByRegExp: {
        template: `import { toReplaceTextByRegExp } from 'adc-directive'

const result = toReplaceTextByRegExp('Hello123World!', ['en', 'number'])
// Expected: 'Hello123World'`,
        description: 'แทนที่ข้อความด้วย RegExp pattern',
    },

    // Date Utilities
    dateDiff: {
        template: `import { dateDiff } from 'adc-directive'

const result = dateDiff(new Date('2024-01-01'), new Date('2024-01-15'))
// Expected: { days: 14, hours: 0, minutes: 0, seconds: 0 }`,
        description: 'คำนวณความต่างระหว่างวันที่',
    },
    addDate: {
        template: `import { addDate } from 'adc-directive'

const result = addDate(new Date('2024-01-01'), 7)
// Expected: 2024-01-08`,
        description: 'เพิ่มหรือลดจำนวนวัน',
    },
    addMonth: {
        template: `import { addMonth } from 'adc-directive'

const result = addMonth(new Date('2024-01-01'), 2)
// Expected: 2024-03-01`,
        description: 'เพิ่มหรือลดจำนวนเดือน',
    },
    addHour: {
        template: `import { addHour } from 'adc-directive'

const result = addHour(new Date('2024-01-01 10:00'), 3)
// Expected: 2024-01-01 13:00`,
        description: 'เพิ่มหรือลดจำนวนชั่วโมง',
    },
    addMinute: {
        template: `import { addMinute } from 'adc-directive'

const result = addMinute(new Date('2024-01-01 10:00'), 30)
// Expected: 2024-01-01 10:30`,
        description: 'เพิ่มหรือลดจำนวนนาที',
    },
    dateToCombine: {
        template: `import { dateToCombine } from 'adc-directive'

const result = dateToCombine(new Date('2024-01-01'))
// Expected: {
//   valueOfDate: '2024-01-01',
//   valueOfTime: '00:00:00',
//   valueOfValue: '2024-01-01 00:00:00',
//   th: '1 มกราคม 2567'
// }`,
        description: 'แปลงวันที่เป็นรูปแบบต่างๆ',
    },

    // Object Utilities
    mergeObject: {
        template: `import { mergeObject } from 'adc-directive'

const result = mergeObject(
  { a: 1, b: { c: 2 } },
  { b: { d: 3 }, e: 4 }
)
// Expected: { a: 1, b: { c: 2, d: 3 }, e: 4 }`,
        description: 'รวม objects แบบ deep merge',
    },
    findObjectByKey: {
        template: `import { findObjectByKey } from 'adc-directive'

const obj = { user: { profile: { name: 'John' } } }
const result = findObjectByKey(obj, ['user.profile.name'])
// Expected: true`,
        description: 'ค้นหา key ใน object แบบ nested',
    },
    selectObject: {
        template: `import { selectObject } from 'adc-directive'

const obj = { id: 1, name: 'John', age: 30 }
const result = selectObject(obj, ['id', 'name'])
// Expected: { id: 1, name: 'John' }`,
        description: 'เลือกเฉพาะ keys ที่ต้องการ',
    },
    checkNestedValue: {
        template: `import { checkNestedValue } from 'adc-directive'

const data = {
  colors: ['red', 'blue'],
  user: { name: 'John' }
}
const result = checkNestedValue(data, {
  colors: ['red', 'blue'],
  'user.name': 'John'
})
// Expected: true`,
        description: 'ตรวจสอบค่าใน nested object',
    },

    // Number Utilities
    toNumber: {
        template: `import { toNumber } from 'adc-directive'

const result1 = toNumber('123')    // Expected: 123
const result2 = toNumber('abc')    // Expected: 0
const result3 = toNumber(null)     // Expected: 0`,
        description: 'แปลงค่าเป็นตัวเลข',
    },
    toCurrency: {
        template: `import { toCurrency } from 'adc-directive'

const result = toCurrency(1234567.89, 2)
// Expected: '1,234,567.89'`,
        description: 'จัดรูปแบบตัวเลขให้อยู่ในรูปแบบเงิน',
    },
    toRandomNumber: {
        template: `import { toRandomNumber } from 'adc-directive'

const result = toRandomNumber(1, 100)
// Expected: random number between 1-100`,
        description: 'สุ่มตัวเลขในช่วงที่กำหนด',
    },

    // Validation Utilities
    checkEmpty: {
        template: `import { checkEmpty } from 'adc-directive'

const result1 = checkEmpty('')     // Expected: true
const result2 = checkEmpty([])     // Expected: true
const result3 = checkEmpty({})     // Expected: true
const result4 = checkEmpty('abc')  // Expected: false`,
        description: 'ตรวจสอบค่าว่าง',
    },
    checkObject: {
        template: `import { checkObject } from 'adc-directive'

const result1 = checkObject({})        // Expected: true
const result2 = checkObject([])        // Expected: false
const result3 = checkObject(null)      // Expected: false`,
        description: 'ตรวจสอบว่าเป็น object',
    },
    validateEmail: {
        template: `import { validateEmail } from 'adc-directive'

const result = validateEmail('test@email.com', {
  allowEmpty: false,
  maxLength: 100
})
// Expected: { isValid: true, message: '' }`,
        description: 'ตรวจสอบความถูกต้องของอีเมล',
    },

    // Composition Utilities
    ci: {
        template: `import { ci } from 'adc-directive'

const result = ci(
  5,
  x => x + 1,    // 6
  x => x * 2     // 12
)
// Expected: 12`,
        description: 'Chain/compose functions เข้าด้วยกัน',
    },
    withCi: {
        template: `import { withCi } from 'adc-directive'

const addOne = x => x + 1
const double = x => x * 2

const compute = withCi(addOne, double)
const result = compute(5)
// Expected: 12`,
        description: 'สร้าง function composition wrapper',
    },

    // Service Utilities
    copyDeep: {
        template: `import { copyDeep } from 'adc-directive'

const obj = { a: 1, b: { c: 2 } }
const result = copyDeep(obj)
// Expected: deep copy of object`,
        description: 'สร้างสำเนาข้อมูลแบบ deep copy',
    },
    delayPromise: {
        template: `import { delayPromise } from 'adc-directive'

// รอ 1 วินาที
await delayPromise(1000)

// รอแล้วทำงาน callback
await delayPromise(1000, () => console.log('Done!'))`,
        description: 'สร้าง Promise ที่ทำงานหลังจากเวลาที่กำหนด',
    },
}

// สำหรับการค้นหา
const route = useRoute()
const searchQuery = ref('')

// Function สำหรับ normalize ข้อความเพื่อค้นหาแบบไม่สนใจตัวพิมพ์เล็ก/ใหญ่
const normalizeText = (text: string): string => {
    if (typeof text !== 'string') return ''
    return text.toLowerCase().trim()
}

const highlightText = (text: string): string => {
    if (!searchQuery.value.trim()) return text
    const query = normalizeText(searchQuery.value)
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(
        regex,
        '<mark class="bg-yellow-100 rounded px-1">$1</mark>'
    )
}

// รายละเอียดทั้งหมดของ utilities แยกตามหมวดหมู่
const utilityExamples = [
    {
        category: 'Array Utilities',
        description: 'ฟังก์ชันสำหรับจัดการ Array',
        functions: [
            {
                name: 'mapArray',
                description:
                    'แปลง Array ทุกตัวให้อยู่ในระดับเดียวกัน (Flatten)',
                code: `const nestedArray = [1, [2, 3, [4, 5, [6]]]]
const result = mapArray(nestedArray)
// result: [1, 2, 3, 4, 5, 6]`,
            },
            {
                name: 'chunkArray',
                description: 'แบ่ง Array เป็นชุดตามจำนวนที่กำหนด',
                code: `const items = [1, 2, 3, 4, 5] 
const result = chunkArray(items, 2)
// result: [[1, 2], [3, 4], [5]]`,
            },
            {
                name: 'toChangePositionArray',
                description: 'สลับตำแหน่งข้อมูลใน Array แบบสุ่ม',
                code: `const arr = ['A', 'B', 'C']
const result = toChangePositionArray(arr)
// อาจได้ผลลัพธ์เช่น ['B', 'C', 'A']`,
            },
        ],
    },
    {
        category: 'String Utilities',
        description: 'ฟังก์ชันสำหรับจัดการข้อความ',
        functions: [
            {
                name: 'toCombineText',
                description: 'รวม Array ของข้อความด้วยตัวคั่นที่กำหนด',
                code: `const parts = ['a', 'b', null, 'c']
const result = toCombineText(parts, '_')
// result: 'a_b_c'`,
            },
            {
                name: 'toHasKey',
                description: 'ลบอักขระพิเศษและช่องว่าง เหมาะสำหรับใช้เป็น key',
                code: `const text = '19-55 77_88*99 aBC'
const result = toHasKey(text)
// result: '195577_8899abc'`,
            },
            {
                name: 'toReplaceTextByRegExp',
                description: 'แทนที่ข้อความด้วย RegExp pattern',
                code: `const text = 'Hello123World!'
const result = toReplaceTextByRegExp(text, ['en', 'number'])
// เก็บเฉพาะตัวอักษรภาษาอังกฤษและตัวเลข`,
            },
        ],
    },
    {
        category: 'Date Utilities',
        description: 'ฟังก์ชันสำหรับจัดการวันที่และเวลา',
        functions: [
            {
                name: 'dateDiff',
                description: 'คำนวณความต่างของเวลาระหว่างสองวันที่',
                code: `const diff = dateDiff(date1, date2)
// returns: {
//   days: number,
//   hours: number,
//   minutes: number,
//   seconds: number,
//   milliseconds: number
// }`,
            },
            {
                name: 'addDate',
                description: 'เพิ่มหรือลดจำนวนวัน',
                code: `const date = new Date('2024-01-01')
const result = addDate(date, 7)
// เพิ่ม 7 วัน`,
            },
            {
                name: 'addMonth',
                description: 'เพิ่มหรือลดจำนวนเดือน',
                code: `const date = new Date('2024-01-01')
const result = addMonth(date, 3)
// เพิ่ม 3 เดือน`,
            },
            {
                name: 'addHour',
                description: 'เพิ่มหรือลดจำนวนชั่วโมง',
                code: `const date = new Date('2024-01-01 10:00')
const result = addHour(date, 5)
// เพิ่ม 5 ชั่วโมง`,
            },
            {
                name: 'addMinute',
                description: 'เพิ่มหรือลดจำนวนนาที',
                code: `const date = new Date('2024-01-01 10:00')
const result = addMinute(date, 30)
// เพิ่ม 30 นาที`,
            },
            {
                name: 'dateToCombine',
                description: 'แปลงวันที่เป็นรูปแบบต่างๆ',
                code: `const date = new Date()
const result = dateToCombine(date)
// returns: {
//   valueOfDate: 'YYYY-MM-DD',
//   valueOfTime: 'HH:mm:ss',
//   valueOfValue: 'YYYY-MM-DD HH:mm:ss',
//   th: 'วันที่ภาษาไทย'
// }`,
            },
        ],
    },
    {
        category: 'Object Utilities',
        description: 'ฟังก์ชันสำหรับจัดการ Object',
        functions: [
            {
                name: 'mergeObject',
                description: 'รวม object หลายตัวเข้าด้วยกันแบบ deep merge',
                code: `const obj1 = { a: 1, b: { c: 2 } }
const obj2 = { b: { d: 3 }, e: 4 }
const result = mergeObject(obj1, obj2)
// result: { a: 1, b: { c: 2, d: 3 }, e: 4 }`,
            },
            {
                name: 'findObjectByKey',
                description: 'ค้นหา key ใน object แบบ nested',
                code: `const obj = { user: { profile: { name: 'John' } } }
const exists = findObjectByKey(obj, ['user.profile.name'])
// result: true`,
            },
            {
                name: 'selectObject',
                description: 'เลือกเฉพาะบาง keys จาก object',
                code: `const obj = { id: 1, name: 'John', age: 30 }
const result = selectObject(obj, ['id', 'name'])
// result: { id: 1, name: 'John' }`,
            },
            {
                name: 'checkNestedValue',
                description: 'ตรวจสอบค่าใน nested object',
                code: `const obj = { 
  colors: ['red', 'blue'],
  user: { name: 'John' }
}
const result = checkNestedValue(obj, {
  colors: ['red', 'blue'],
  'user.name': 'John'
})
// result: true`,
            },
        ],
    },
    {
        category: 'Number Utilities',
        description: 'ฟังก์ชันสำหรับจัดการตัวเลข',
        functions: [
            {
                name: 'toNumber',
                description: 'แปลงค่าเป็นตัวเลข',
                code: `toNumber('123') // 123
toNumber('abc') // 0
toNumber(null) // 0`,
            },
            {
                name: 'toCurrency',
                description: 'จัดรูปแบบตัวเลขให้อยู่ในรูปแบบเงิน',
                code: `const num = 1234567.89
const result = toCurrency(num, 2)
// result: '1,234,567.89'`,
            },
            {
                name: 'toRandomNumber',
                description: 'สุ่มตัวเลขในช่วงที่กำหนด',
                code: `const result = toRandomNumber(1, 100)
// สุ่มตัวเลขระหว่าง 1-100`,
            },
        ],
    },
    {
        category: 'Validation Utilities',
        description: 'ฟังก์ชันสำหรับตรวจสอบข้อมูล',
        functions: [
            {
                name: 'checkEmpty',
                description: 'ตรวจสอบค่าว่าง',
                code: `checkEmpty('') // true
checkEmpty([]) // true
checkEmpty({}) // true
checkEmpty(null) // true
checkEmpty('abc') // false`,
            },
            {
                name: 'checkObject',
                description: 'ตรวจสอบว่าเป็น object หรือไม่',
                code: `checkObject({}) // true
checkObject([]) // false
checkObject(null) // false`,
            },
            {
                name: 'checkEmail',
                description: 'ตรวจสอบรูปแบบอีเมล',
                code: `checkEmail('test@email.com') // true
checkEmail('invalid-email') // false`,
            },
            {
                name: 'checkNumber',
                description: 'ตรวจสอบว่าเป็นตัวเลขหรือไม่',
                code: `checkNumber(123) // true
checkNumber('123') // true
checkNumber('abc') // false`,
            },
            {
                name: 'checkFormatDate',
                description: 'ตรวจสอบรูปแบบวันที่',
                code: `checkFormatDate('2024-01-01', 'YYYY-MM-DD') // true
checkFormatDate('01/01/2024', 'DD/MM/YYYY') // true`,
            },
        ],
    },
    {
        category: 'Service Utilities',
        description: 'ฟังก์ชันสำหรับจัดการ service ต่างๆ',
        functions: [
            {
                name: 'copyDeep',
                description: 'สร้างสำเนาข้อมูลแบบ deep copy',
                code: `const obj = { a: 1, b: { c: 2 } }
const copy = copyDeep(obj)
// สร้างสำเนาใหม่ทั้งหมด ไม่มีการอ้างอิงถึงข้อมูลเดิม`,
            },
            {
                name: 'delayPromise',
                description: 'สร้าง Promise ที่จะทำงานหลังจากเวลาที่กำหนด',
                code: `await delayPromise(1000) // รอ 1 วินาที
await delayPromise(2000, () => console.log('Done!'))
// รอ 2 วินาที แล้วทำงาน callback`,
            },
        ],
    },
    {
        category: 'Process Utilities',
        description: 'ฟังก์ชันสำหรับจัดการ process',
        functions: [
            {
                name: 'runProcess',
                description: 'ทำงานกับ Array แบบมีลำดับขั้นตอน',
                code: `const items = [1, 2, 3]
runProcess(items, (item, index) => {
  console.log(\`Processing item \${item} at index \${index}\`)
})

// สามารถกำหนด start index ได้
runProcess(items, callback, 1) // เริ่มจาก index 1`,
            },
        ],
    },
    {
        category: 'Composition Utilities',
        description: 'ฟังก์ชันสำหรับการ compose function',
        functions: [
            {
                name: 'ci',
                description: 'Chain/compose functions เข้าด้วยกัน',
                code: `const result = ci(
  5,
  x => x + 1,    // 6
  x => x * 2     // 12
)
// result: 12`,
            },
            {
                name: 'withCi',
                description: 'สร้าง function composition wrapper',
                code: `const addOne = x => x + 1
const double = x => x * 2

const compute = withCi(
  addOne, 
  double
)

compute(5) // 12`,
            },
        ],
    },
]

// แสดงผลการค้นหาพร้อม highlight
const displayResults = computed(() => {
    if (!searchQuery.value.trim()) {
        return utilityExamples.map((category) => ({
            ...category,
            functions: category.functions.map((func) => ({
                ...func,
                highlightedName: func.name,
                highlightedDescription: func.description,
                highlightedCode: func.code,
            })),
        }))
    }

    const query = normalizeText(searchQuery.value)

    return utilityExamples
        .map((category) => {
            const filteredFunctions = category.functions
                .filter(
                    (func) =>
                        normalizeText(func.name).includes(query) ||
                        normalizeText(func.description).includes(query) ||
                        normalizeText(func.code).includes(query)
                )
                .map((func) => ({
                    ...func,
                    highlightedName: highlightText(func.name),
                    highlightedDescription: highlightText(func.description),
                    highlightedCode: highlightText(func.code),
                }))

            if (filteredFunctions.length === 0) return null

            return {
                ...category,
                functions: filteredFunctions,
            }
        })
        .filter(Boolean)
})

// สถิติการค้นหา
const searchStats = computed(() => {
    if (!searchQuery.value.trim()) return null

    return {
        categories: displayResults.value.length,
        functions: displayResults.value.reduce(
            (sum, category) => sum + (category?.functions.length || 0),
            0
        ),
    }
})

// Copy code to clipboard
const copyCode = async (code: string) => {
    try {
        await navigator.clipboard.writeText(code)
        // อาจเพิ่ม notification ตรงนี้
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

// Scroll to section
const scrollToSection = () => {
    if (route.hash) {
        const element = document.querySelector(route.hash)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }
}
const handlerResetExample = () => {
    selectedExample.value = 'toCombineText'
    handleExampleChange('toCombineText')
}

onMounted(() => {
    scrollToSection()
})

watch(
    () => route.hash,
    () => scrollToSection()
)

// Handle example change in playground
const handleExampleChange = (example: string) => {
    console.log('Example:', example)
    codeInput.value = examples[example as ExampleKey].template
    codeInput.value = examples[example as ExampleKey].template
}
</script>

<template>
    <BcLayout
        title="ADC Directive"
        subtitle="Utility functions สำหรับ TypeScript/JavaScript"
        icon="Code"
    >
        <!-- Search Section -->
        <section class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div class="flex items-center gap-3 mb-6">
                <BcIcon name="Search" size="24" color="primary" />
                <div class="flex-1">
                    <h2 class="text-xl font-bold">ค้นหาฟังก์ชัน</h2>
                    <p class="text-sm text-slate-600 mt-1">
                        ค้นหาจากชื่อฟังก์ชัน คำอธิบาย หรือโค้ดตัวอย่าง
                    </p>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <BcInput
                    id="searchQuery"
                    :data-value="searchQuery"
                    @input="(v) => (searchQuery = v as string)"
                    placeholder="พิมพ์คำค้นหา..."
                    icon="Search"
                />

                <div
                    v-if="searchQuery.trim() && searchStats"
                    class="text-sm text-slate-600"
                >
                    พบ {{ searchStats.functions }} ฟังก์ชัน ใน
                    {{ searchStats.categories }} หมวดหมู่
                </div>
            </div>
        </section>

        <!-- Interactive Playground -->
        <section
            v-if="!searchQuery.trim()"
            class="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
            <div class="flex items-center gap-3 mb-6">
                <BcIcon name="Palette" size="24" color="primary" />
                <div>
                    <h2 class="text-xl font-bold">Interactive Playground</h2>
                    <p class="text-sm text-slate-600 mt-1">
                        ทดลองใช้งานฟังก์ชันต่างๆ
                    </p>
                </div>
            </div>

            <div class="grid gap-4">
                <div class="flex gap-4">
                    <select
                        v-model="selectedExample"
                        class="px-4 py-2 border rounded"
                        @change="handleExampleChange(selectedExample)"
                    >
                        <option
                            v-for="(ex, key) in examples"
                            :key="ex.template"
                            :value="key"
                        >
                            {{ key }}
                        </option>
                    </select>
                    <BcButton
                        variant="primary"
                        icon="RefreshCw"
                        @click="handlerResetExample"
                    >
                        ล้างข้อมูล
                    </BcButton>
                </div>

                <div class="grid bg-slate-800 rounded-lg p-4">
                    <BcButton
                        @click="copyCode(codeInput)"
                        variant="white"
                        icon="Copy"
                        class="ml-auto"
                        size="sm"
                    />
                    <textarea
                        v-model="codeInput"
                        class="w-full h-40 p-4 font-mono text-sm bg-transparent text-white focus:outline-none"
                    />
                </div>

                <div class="text-sm text-slate-600">
                    <p>{{ examples[selectedExample].description }}</p>
                </div>
            </div>
        </section>

        <!-- Function Categories -->
        <template v-for="category in displayResults" :key="category.category">
            <section
                :id="category?.category?.toLowerCase().replace(/ /g, '-')"
                class="mb-8"
            >
                <div class="flex items-center gap-3 mb-6">
                    <BcIcon name="Code" size="24" color="primary" />
                    <div>
                        <h2 class="text-xl font-bold">
                            {{ category?.category }}
                        </h2>
                        <p class="text-sm text-slate-600 mt-1">
                            {{ category?.description }}
                        </p>
                    </div>
                </div>

                <div class="space-y-6">
                    <div
                        v-for="func in category?.functions"
                        :key="func.name"
                        class="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h3
                            class="text-lg font-bold mb-2"
                            v-html="func.highlightedName"
                        />
                        <p
                            class="text-slate-600 mb-4"
                            v-html="func.highlightedDescription"
                        />
                        <div class="grid bg-slate-800 rounded-lg p-4">
                            <BcButton
                                @click="copyCode(func.code)"
                                variant="white"
                                icon="Copy"
                                class="ml-auto"
                                size="sm"
                            />
                            <pre><code v-html="func.highlightedCode" /></pre>
                        </div>
                    </div>
                </div>
            </section>
        </template>

        <!-- No Results -->
        <div
            v-if="searchQuery.trim() && !displayResults.length"
            class="bg-white rounded-xl shadow-lg p-8 text-center"
        >
            <BcIcon
                name="Search"
                size="48"
                class="mx-auto mb-4 text-slate-400"
            />
            <h3 class="text-lg font-bold text-slate-700">ไม่พบผลการค้นหา</h3>
            <p class="text-slate-600 mt-2">
                ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกดอีกครั้ง
            </p>
        </div>
    </BcLayout>
</template>

<style scoped>
/* Existing styles ... */

/* Code block styling */
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: ui-monospace, monospace;
    background-color: rgb(30 41 59); /* slate-800 */
    color: #e2e8f0; /* slate-200 */
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0;
}

code {
    font-family: inherit;
    color: #fff;
}

/* Style for inline code */
:deep(code:not(pre code)) {
    background-color: rgb(241 245 249); /* slate-100 */
    color: rgb(71 85 105); /* slate-600 */
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
}

/* Syntax highlighting colors */
:deep(.string) {
    color: #a5d6ff;
}
:deep(.number) {
    color: #ff9580;
}
:deep(.boolean) {
    color: #ffb1bb;
}
:deep(.comment) {
    color: #8b949e;
    font-style: italic;
}
:deep(.keyword) {
    color: #ff7b72;
}
:deep(.function) {
    color: #d2a8ff;
}
:deep(.operator) {
    color: #79c0ff;
}

/* Make copy button more visible */
.bg-slate-800 :deep(.bg-white) {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    color: rgb(30 41 59); /* slate-800 */
}

/* Improve button hover state */
.bg-slate-800 :deep(.bg-white:hover) {
    --tw-bg-opacity: 0.9;
}

/* Section scroll margin */
section {
    scroll-margin-top: 6rem;
}

/* Search highlight styling */
:deep(mark) {
    background-color: rgb(254 243 199);
    padding: 0 0.25rem;
    border-radius: 0.25rem;
    font-weight: 500;
}

/* Search highlight in code blocks */
pre :deep(mark) {
    background-color: rgba(254, 243, 199, 0.2);
    color: inherit;
}

/* Interactive playground textarea */
textarea.code-input {
    background-color: rgb(30 41 59);
    color: #e2e8f0;
    width: 100%;
    font-family: ui-monospace, monospace;
    resize: vertical;
    min-height: 150px;
}
</style>
