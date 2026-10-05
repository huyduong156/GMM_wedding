<?php
declare(strict_types=1);

const SITE_ORIGIN = 'https://ourday.asia';
const API_ORIGIN = 'https://api.ourday.asia';
const FALLBACK_IMAGE = SITE_ORIGIN . '/assets/logo/ourday-logo.png';

function html_value(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function fetch_json(string $url): ?array
{
    $body = false;
    if (function_exists('curl_init')) {
        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_TIMEOUT => 4,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
            CURLOPT_USERAGENT => 'OurdayMetadataRenderer/1.0',
        ]);
        $body = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        curl_close($handle);
        if ($status !== 200) {
            $body = false;
        }
    } elseif (filter_var(ini_get('allow_url_fopen'), FILTER_VALIDATE_BOOLEAN)) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 4,
                'ignore_errors' => true,
                'header' => "Accept: application/json\r\nUser-Agent: OurdayMetadataRenderer/1.0\r\n",
            ],
        ]);
        $body = @file_get_contents($url, false, $context);
    }

    if (!is_string($body) || $body === '') {
        return null;
    }
    $decoded = json_decode($body, true);
    return is_array($decoded) ? $decoded : null;
}

function nested_value(array $source, array $path)
{
    $value = $source;
    foreach ($path as $key) {
        if (!is_array($value) || !array_key_exists($key, $value)) {
            return null;
        }
        $value = $value[$key];
    }
    return $value;
}

function first_string(array $source, array $paths): ?string
{
    foreach ($paths as $path) {
        $value = nested_value($source, $path);
        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }
    }
    return null;
}

function media_source($value): ?string
{
    if (is_string($value) && trim($value) !== '') {
        return trim($value);
    }
    if (!is_array($value)) {
        return null;
    }
    foreach (['src', 'url', 'publicUrl'] as $key) {
        if (isset($value[$key]) && is_string($value[$key]) && trim($value[$key]) !== '') {
            return trim($value[$key]);
        }
    }
    return null;
}

function first_media(array $source, array $paths): ?string
{
    foreach ($paths as $path) {
        $media = media_source(nested_value($source, $path));
        if ($media !== null) {
            return $media;
        }
    }
    return null;
}

function absolute_media_url(?string $value): string
{
    if ($value === null || $value === '') {
        return FALLBACK_IMAGE;
    }
    if (preg_match('~^https?://~i', $value) === 1) {
        return $value;
    }
    if (strpos($value, '//') === 0) {
        return 'https:' . $value;
    }
    if (strpos($value, '/api/') === 0) {
        return API_ORIGIN . $value;
    }
    return SITE_ORIGIN . '/' . ltrim($value, '/');
}

function replace_meta(string $html, string $attribute, string $key, string $content): string
{
    $tag = '<meta ' . $attribute . '="' . html_value($key) . '" content="' . html_value($content) . '" />';
    $pattern = '~<meta\s+[^>]*' . preg_quote($attribute, '~') . '=["\']' . preg_quote($key, '~') . '["\'][^>]*>~i';
    if (preg_match($pattern, $html) === 1) {
        return (string) preg_replace($pattern, $tag, $html, 1);
    }
    return str_replace('</head>', '    ' . $tag . "\n  </head>", $html);
}

function replace_canonical(string $html, string $url): string
{
    $tag = '<link rel="canonical" href="' . html_value($url) . '" />';
    $pattern = '~<link\s+[^>]*rel=["\']canonical["\'][^>]*>~i';
    if (preg_match($pattern, $html) === 1) {
        return (string) preg_replace($pattern, $tag, $html, 1);
    }
    return str_replace('</head>', '    ' . $tag . "\n  </head>", $html);
}

$surface = isset($_GET['surface']) && is_string($_GET['surface']) ? $_GET['surface'] : '';
$slug = isset($_GET['slug']) && is_string($_GET['slug']) ? $_GET['slug'] : '';
$allowedSurfaces = ['invitation', 'website', 'recap'];
$indexFile = __DIR__ . '/index.html';

if (!in_array($surface, $allowedSurfaces, true) || preg_match('/^[a-z0-9-]+$/', $slug) !== 1) {
    http_response_code(404);
    exit;
}

$html = @file_get_contents($indexFile);
if (!is_string($html)) {
    http_response_code(500);
    exit;
}

$endpoint = $surface === 'invitation'
    ? '/api/public/invitations/' . rawurlencode($slug)
    : ($surface === 'website'
        ? '/api/public/websites/' . rawurlencode($slug)
        : '/api/public/recaps/' . rawurlencode($slug));
$response = fetch_json(API_ORIGIN . $endpoint);
$snapshot = is_array($response) && isset($response['snapshot']) && is_array($response['snapshot'])
    ? $response['snapshot']
    : [];
$payload = isset($snapshot['payload']) && is_array($snapshot['payload']) ? $snapshot['payload'] : [];
$content = isset($payload['content']) && is_array($payload['content']) ? $payload['content'] : $payload;

$bride = first_string($content, [
    ['brideName'],
    ['couple', 'brideName'],
    ['hero', 'brideName'],
]);
$groom = first_string($content, [
    ['groomName'],
    ['couple', 'groomName'],
    ['hero', 'groomName'],
]);
$couple = implode(' & ', array_values(array_filter([$bride, $groom])));
if ($couple === '') {
    $couple = first_string($content, [['hero', 'couple'], ['couple']]) ?? '';
}
$label = $surface === 'invitation' ? 'Thiệp cưới' : ($surface === 'website' ? 'Website cưới' : 'Wedding Recap');
$title = first_string($payload, [['ogTitle']]) ?? ($couple !== '' ? $couple . ' | ' . $label : $label . ' | Ourday');
$defaultDescription = $couple === ''
    ? 'Một không gian cưới được tạo bằng Ourday.'
    : ($surface === 'recap'
        ? 'Cùng nhìn lại những khoảnh khắc đáng nhớ trong ngày cưới của ' . $couple . '.'
        : ($surface === 'website'
            ? 'Cùng khám phá câu chuyện và những thông tin về ngày cưới của ' . $couple . '.'
            : 'Trân trọng mời bạn đến chung vui trong ngày cưới của ' . $couple . '.'));
$description = first_string($payload, [['ogDescription']]) ?? $defaultDescription;
$image = absolute_media_url(first_string($payload, [['ogImageUrl']]) ?? first_media($content, [
    ['ogImageUrl'],
    ['heroMedia'],
    ['openingMediaFront'],
    ['coverBackgroundMedia'],
    ['hero', 'image'],
    ['hero', 'media'],
    ['cover', 'heroMedia'],
    ['cover', 'image'],
]));

$canonicalPath = $surface === 'invitation'
    ? '/' . rawurlencode($slug) . '/invitation'
    : ($surface === 'website'
        ? '/' . rawurlencode($slug) . '/website'
        : '/' . rawurlencode($slug) . '/recaps');
$canonicalUrl = SITE_ORIGIN . $canonicalPath;
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? $canonicalPath, PHP_URL_PATH);
$socialUrl = SITE_ORIGIN . (is_string($requestPath) ? $requestPath : $canonicalPath);
$personalized = $surface === 'invitation' && preg_match('~^/[^/]+/invitation/[^/]+/?$~', (string) $requestPath) === 1;

$html = (string) preg_replace('~<title>.*?</title>~is', '<title>' . html_value($title) . '</title>', $html, 1);
$html = replace_meta($html, 'name', 'description', $description);
$html = replace_meta($html, 'name', 'robots', $personalized ? 'noindex,nofollow' : 'index,follow');
$html = replace_meta($html, 'property', 'og:type', 'website');
$html = replace_meta($html, 'property', 'og:site_name', 'Ourday');
$html = replace_meta($html, 'property', 'og:title', $title);
$html = replace_meta($html, 'property', 'og:description', $description);
$html = replace_meta($html, 'property', 'og:image', $image);
$html = replace_meta($html, 'property', 'og:url', $socialUrl);
$html = replace_meta($html, 'name', 'twitter:card', 'summary_large_image');
$html = replace_meta($html, 'name', 'twitter:title', $title);
$html = replace_meta($html, 'name', 'twitter:description', $description);
$html = replace_meta($html, 'name', 'twitter:image', $image);
$html = replace_canonical($html, $canonicalUrl);

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=300');
header('Vary: User-Agent');
echo $html;
