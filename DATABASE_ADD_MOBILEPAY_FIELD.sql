-- Add MobilePay field to webshops table
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS mobilepay_accepted BOOLEAN DEFAULT false;

-- Update comment to document the new field
COMMENT ON COLUMN webshops_dk847392.mobilepay_accepted IS 'Indicates whether the webshop accepts MobilePay payments';

-- Optional: Update some existing webshops to have MobilePay if you know they support it
-- UPDATE webshops_dk847392 
-- SET mobilepay_accepted = true 
-- WHERE name IN ('Zalando', 'H&M', 'Elgiganten'); -- Example shops that likely support MobilePay

-- Verify the changes
SELECT name, mobilepay_accepted FROM webshops_dk847392 LIMIT 5;