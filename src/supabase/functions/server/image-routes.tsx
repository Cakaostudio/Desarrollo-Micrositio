import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";

const imageRoutes = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const BUCKET_NAME = "make-2ce8a38a-project-images";

// Initialize storage bucket on startup
async function initializeBucket() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }
    
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make images publicly accessible
        fileSizeLimit: 5242880, // 5MB limit
      });

      if (error) {
        // Check if error is due to bucket already existing
        if (error.message?.includes("already exists")) {
          console.log(`Bucket ${BUCKET_NAME} already exists (race condition handled)`);
        } else {
          console.error("Error creating bucket:", error);
        }
      } else {
        console.log(`Bucket ${BUCKET_NAME} created successfully`);
      }
    } else {
      console.log(`Bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error) {
    console.error("Error initializing bucket:", error);
  }
}

// Initialize bucket when module loads
initializeBucket();

/**
 * Upload an image to Supabase Storage
 * Expects multipart/form-data with a 'file' field
 */
imageRoutes.post("/upload", async (c) => {
  try {
    console.log("=== POST /images/upload ===");
    console.log("Headers:", c.req.header());

    // Get the form data
    const formData = await c.req.formData();
    console.log("FormData received");
    
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.error("No file provided or invalid file type");
      return c.json(
        {
          success: false,
          error: "No file provided or invalid file",
        },
        400
      );
    }

    console.log("File received:", file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        400
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json(
        {
          success: false,
          error: "File too large. Maximum size is 5MB.",
        },
        400
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}-${randomStr}.${extension}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading to Supabase:", error);
      return c.json(
        {
          success: false,
          error: "Failed to upload image to storage",
          details: error.message,
        },
        500
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    console.log("Upload successful:", publicUrl);

    return c.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error in upload route:", error);
    return c.json(
      {
        success: false,
        error: "Failed to upload image",
        details: String(error),
      },
      500
    );
  }
});

/**
 * Delete an image from Supabase Storage
 * Expects { fileName: string } in request body
 */
imageRoutes.delete("/delete", async (c) => {
  try {
    console.log("=== DELETE /delete ===");

    const { fileName } = await c.req.json();

    if (!fileName) {
      return c.json(
        {
          success: false,
          error: "File name is required",
        },
        400
      );
    }

    console.log("Deleting file:", fileName);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error("Error deleting from Supabase:", error);
      return c.json(
        {
          success: false,
          error: "Failed to delete image",
          details: error.message,
        },
        500
      );
    }

    console.log("Delete successful");

    return c.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete route:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete image",
        details: String(error),
      },
      500
    );
  }
});

/**
 * Get information about the storage bucket
 */
imageRoutes.get("/info", async (c) => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucket = buckets?.find((b) => b.name === BUCKET_NAME);

    return c.json({
      success: true,
      bucket: bucket || null,
      bucketName: BUCKET_NAME,
    });
  } catch (error) {
    console.error("Error getting bucket info:", error);
    return c.json(
      {
        success: false,
        error: "Failed to get bucket info",
        details: String(error),
      },
      500
    );
  }
});

export default imageRoutes;