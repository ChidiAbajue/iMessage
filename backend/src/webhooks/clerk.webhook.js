import express from "express"
import User from "../models/user.model.js"
import { verifyWebhook } from "@clerk/backend/webhooks"

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        console.log("[webhook] request received", {
            method: req.method,
            url: req.originalUrl,
            contentType: req.headers["content-type"],
            hasBody: Boolean(req.body)
        })

        const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET
        if (!signingSecret) {
            console.error("[webhook] missing CLERK_WEBHOOK_SIGNING_SECRET")
            res.status(503).json({ message: "Webhook secret is not provided" })
            return
        }

        // Clerk's verifier expects a Web Request with the raw body; express.raw gives a Buffer.
        const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body)
        const request = new Request("http://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers(req.headers),
            body: payload,
        })

        console.log("[webhook] verifying signature...")

        // Throws if the signature is wrong or the body was tampered with; only then do we trust evt.
        const evt = await verifyWebhook(request, { signingSecret })

        console.log("[webhook] signature verified", {
            type: evt?.type,
            eventId: evt?.data?.id,
            timestamp: evt?.timestamp
        })

        if (evt.type === "user.created" || evt.type === "user.updated") {
            const u = evt.data

            const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ?? u.email_addresses?.[0]?.email_address
            const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")[0]

            console.log("[webhook] preparing upsert for user", {
                clerkId: u.id,
                email,
                fullName,
                imageUrl: u.image_url
            })

            const savedUser = await User.findOneAndUpdate(
                { clerkId: u.id },
                {
                    clerkId: u.id,
                    email,
                    fullName,
                    profilePic: u.image_url
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            )

            console.log("[webhook] user upsert completed", {
                clerkId: u.id,
                savedUserId: savedUser?._id,
                savedEmail: savedUser?.email,
                savedFullName: savedUser?.fullName
            })
        }

        if (evt.type === "user.deleted") {
            if (evt.data.id) {
                console.log("[webhook] deleting user from Mongo", { clerkId: evt.data.id })
                const deleted = await User.findOneAndDelete({ clerkId: evt.data.id })
                console.log("[webhook] user deletion completed", {
                    clerkId: evt.data.id,
                    deletedUserId: deleted?._id
                })
            }
        }

        console.log("[webhook] success response sent", { type: evt.type })
        res.status(200).json({ received: true })
    } catch (error) {
        console.error("[webhook] error in Clerk webhook: ", error)
        res.status(400).json({ message: "Webhook Verification failed" })
    }
})

export default router