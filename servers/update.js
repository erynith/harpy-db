import fetch from "node-fetch"
import fs from "fs"

const serverList = [
    {
        address: "traingame.kncgaming.com",
        discord: "https://discord.gg/hNv2yu4PKh",
        tags: ["Casual"],
        mods: []
    },
    {
        address: "tmm.luunar.sh",
        discord: null,
        tags: ["Casual", "Chaotic"],
        mods: []
    },
    {
        address: "trainmurdermystery.luunar.sh",
        discord: null,
        tags: ["Casual", "Chaotic"],
        mods: []
    },
    {
        address: "loretraingame.kncgaming.com",
        discord: "https://discord.gg/hNv2yu4PKh",
        tags: ["Whitelist Only", "Roleplay"],
        mods: []
    },
    {
        address: "harpy.lorenzloening.com",
        discord: "https://discord.gg/99aur2Grxd",
        tags: ["Voice Chat Required", "Roleplay"],
        mods: []
    },
    {
        address: "tmm.sleepyapril.net",
        discord: "https://discord.gg/nfVv35PUhU",
        tags: ["Casual", "Chaotic", "Modded"],
        mods: [
            { name: "Noelle's Roles", url: "https://modrinth.com/mod/noelles-roles-tmm" }
        ]
    },
    {
        address: "devtraingame.kncgaming.com",
        discord: "https://discord.gg/hNv2yu4PKh",
        tags: ["Whitelist Only", "Creative Mode", "Building"],
        mods: []
    },
    {
        address: "myip.enimc.de:25567",
        discord: null,
        tags: ["Roleplay"],
        mods: []
    },
    {
        address: "rat.eonhub.nl:25592",
        discord: null,
        tags: [],
        mods: []
    },
    {
        address: "185.83.153.44:25592",
        discord: null,
        tags: [],
        mods: []
    },
    {
        address: "murdertrain.nodecraft.gg",
        discord: null,
        tags: [],
        mods: []
    },
    {
        address: "energy-points.gl.joinmc.link",
        discord: null,
        tags: ["Modded"],
        mods: [
            { name: "Noelle's Roles", url: "https://modrinth.com/mod/noelles-roles-tmm" }
        ]
    },
    {
        address: "catattack40.modrinth.gg",
        discord: null,
        tags: [],
        mods: []
    },
    {
        address: "148.251.54.69:25580",
        discord: null,
        tags: [],
        mods: []
    },
    {
        address: "atlantic-royale-the-last-voyage.nodecraft.gg",
        discord: null,
        tags: [],
        mods: []
    }
]

async function updateServerDb() {
    const mcstatus = []
    for (let i = 0; i < serverList.length; i++) {
        const s = serverList[i]
        s.statuspage = `https://mcstatus.io/status/java/${s.address}`
        try {
            const r = await fetch(`https://api.mcstatus.io/v2/status/java/${s.address}`)
            const data = await r.json().catch(() => null)
            mcstatus.push({ ...s, data })
            console.log(`✔️ ${s.address}`)
        } catch {
            mcstatus.push({ ...s, data: null })
            console.log(`❌ ${s.address}`)
        }
    }

    const duplicates = new Set()
    const results = mcstatus.filter(({ data }) => {
        const serverHost = data?.srv_record?.host || data?.ip_address || data?.host
        if (!serverHost) return true
        if (duplicates.has(serverHost)) return false
        duplicates.add(serverHost)
        return true
    })

    results.sort((a, b) => {
        const online1 = a.data?.online ? 1 : 0
        const online2 = b.data?.online ? 1 : 0
        if (online1 !== online2) return online2 - online1

        const players1 = a.data?.players?.online || 0
        const players2 = b.data?.players?.online || 0
        return players2 - players1
    })

    fs.writeFileSync("db.json", JSON.stringify(results, null, 4), "utf-8")
}

updateServerDb()
